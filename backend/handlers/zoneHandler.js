const Device = require('../models/Device');
const Beacon = require('../models/Beacon');
const DeviceZonePosition = require('../models/DeviceZonePosition');
const Zone = require('../models/Zone');
const Employee = require('../models/Employee');
const ZoneEvent = require('../models/ZoneEvent');
const ZoneViolation = require('../models/ZoneViolation');
const EmployeeZoneAssignment = require('../models/EmployeeZoneAssignment');
const Movement = require('../models/Movement');
const { broadcast } = require('../websocketServer');
const { Op, Sequelize } = require('sequelize');
const CICDecimator = require('../utils/CICDecimator'); // Импорт CIC-фильтра

// Время ожидания без сигнала от устройства для фиксации выхода из зоны (например, 5 минут)
const EXIT_TIMEOUT = 5 * 60 * 1000;

// Объект для хранения таймаутов по устройствам
const exitTimeouts = {};

// Создание экземпляра CIC-фильтра
const cicDecimator = new CICDecimator(1, 2); // Пример: 3-ый порядок, коэффициент децимации 10

const handleZonePositionMessage = async (deviceId, payload) => {
  if (!deviceId) {
    console.error('deviceId is null or undefined:', deviceId);
    return;
  }
  console.log('Processing message for device:', deviceId);

  if (payload.message) {
    for (const key in payload.message) {
      if (payload.message.hasOwnProperty(key)) {
        const { ts, bInst, rssi, T, P } = payload.message[key];

        if (!bInst) {
          console.error('bInst is null or undefined:', bInst);
          continue;
        }

        if (rssi <= -90) {
          continue;
        }

        // Применение CIC-фильтра к данным RSSI
        const filteredRssi = cicDecimator.process(rssi);
        if (filteredRssi === null) {
          // Недостаточно данных для фильтрации
          continue;
        }

        let beaconDevice;
        try {
          beaconDevice = await Device.findByPk(bInst);
          if (!beaconDevice) {
            beaconDevice = await Device.create({
              id: bInst,
              devicetype: 'beacon',
              createdat: new Date(),
              updatedat: new Date()
            });
            console.log('New beacon device created successfully:', bInst);
          }
        } catch (error) {
          console.error('Database error while creating beacon:', error);
          continue;
        }

        let beacon;
        try {
          beacon = await Beacon.findOrCreate({
            where: { beacon_mac: bInst },
            defaults: {
              zone_id: null,
              map_coordinates: null,
              gps_coordinates: null
            }
          });
          beacon = beacon[0];
          console.log('Beacon record created or found successfully:', bInst);
        } catch (error) {
          console.error('Database error while creating beacon record:', error);
          continue;
        }

        try {
          await Device.upsert({
            id: deviceId,
            devicetype: 'badge',
            createdat: new Date(),
            updatedat: new Date()
          });
          console.log('Device upserted successfully:', deviceId);
        } catch (error) {
          console.error('Database error while creating device:', error);
          continue;
        }

        let zoneId = beacon.zone_id;

        if (!zoneId) {
          try {
            const zone = await Zone.findOne({
              where: Sequelize.literal(`"beacons" @> ARRAY['${bInst}']::text[]`)
            });
            if (zone) {
              zoneId = zone.id;
              await beacon.update({ zone_id: zoneId });
            }
          } catch (error) {
            console.error('Database error while finding zone:', error);
            continue;
          }
        }

        try {
          await DeviceZonePosition.upsert({
            device_id: deviceId,
            zone_id: zoneId,
            timestamp: new Date(ts * 1000),
            rssi: filteredRssi,
            temperature: T,
            pressure: P,
            createdat: new Date(),
            updatedat: new Date()
          }, {
            conflictFields: ['device_id', 'zone_id', 'timestamp']
          });

          console.log('Zone position saved successfully');

          let employee = await Employee.findOne({ where: { beaconid: deviceId } });

          if (!employee) {
            console.error('Employee not found for device:', deviceId);
            continue;
          }

          await Movement.create({
            device_id: deviceId,
            employee_id: employee.id,
            timestamp: new Date(ts * 1000),
            zone_id: zoneId,
            beacon_mac: bInst,
            map_coordinates: beacon.map_coordinates,
          });

          const existingEnterEvent = await ZoneEvent.findOne({
            where: {
              employee_id: employee.id,
              zone_id: zoneId,
              event_type: 'enter',
              duration: { [Op.is]: null }
            }
          });

          if (!existingEnterEvent) {
            if (zoneId) {
              await ZoneEvent.create({
                employee_id: employee.id,
                zone_id: zoneId,
                event_type: 'enter',
                timestamp: new Date(ts * 1000)
              });

              const forbiddenZoneAssignment = await EmployeeZoneAssignment.findOne({
                where: {
                  employee_id: employee.id,
                  zone_id: zoneId,
                  assignment_type: 'forbidden'
                }
              });

              if (forbiddenZoneAssignment) {
                await ZoneViolation.create({
                  employee_id: employee.id,
                  zone_id: zoneId,
                  zone_type: 'forbidden',
                  timestamp: new Date(ts * 1000)
                });

                broadcast({
                  type: 'zone_violation',
                  data: {
                    employee_id: employee.id,
                    employee: `${employee.last_name} ${employee.first_name[0]}. ${employee.middle_name[0]}.`,
                    zone_id: zoneId,
                    zone_name: `Зона ${zoneId}`,
                    beacon_id: bInst,
                    event_type: 'вошел в запрещенную зону',
                    timestamp: new Date(ts * 1000).toLocaleString(),
                    message: 'Сотрудник вошел в запрещенную зону'
                  }
                });
              }
            }
          }

          if (exitTimeouts[deviceId]) {
            clearTimeout(exitTimeouts[deviceId]);
            delete exitTimeouts[deviceId];
          }

          exitTimeouts[deviceId] = setTimeout(async () => {
            try {
              const lastEvent = await ZoneEvent.findOne({
                where: {
                  employee_id: employee.id,
                  zone_id: zoneId,
                  event_type: 'enter',
                  duration: { [Op.is]: null }
                },
                order: [['timestamp', 'DESC']]
              });

              if (lastEvent) {
                const duration = Math.floor((Date.now() - new Date(lastEvent.timestamp).getTime()) / 1000);
                await lastEvent.update({ duration });

                await ZoneEvent.create({
                  employee_id: employee.id,
                  zone_id: zoneId,
                  event_type: 'exit',
                  timestamp: new Date()
                });

                broadcast({
                  type: 'zone_exit',
                  data: {
                    employee_id: employee.id,
                    employee: `${employee.last_name} ${employee.first_name[0]}. ${employee.middle_name[0]}.`,
                    zone_id: zoneId,
                    zone_name: `Зона ${zoneId}`,
                    beacon_id: bInst,
                    event_type: 'вышел из зоны',
                    timestamp: new Date().toLocaleString(),
                    message: 'Сотрудник вышел из зоны'
                  }
                });

                console.log(`Employee ${employee.id} exited zone ${zoneId} due to inactivity`);
              }
            } catch (error) {
              console.error('Error creating exit event:', error);
            }
          }, EXIT_TIMEOUT);

          const updatedData = {
            type: 'zone_event',
            data: {
              employee_id: employee.id,
              employee: `${employee.last_name} ${employee.first_name[0]}. ${employee.middle_name[0]}.`,
              zone_id: zoneId,
              zone_name: `Зона ${zoneId}`,
              beacon_id: bInst,
              event_type: existingEnterEvent ? 'вошел в зону' : 'вышел из зоны',
              timestamp: new Date(ts * 1000).toLocaleString(),
            }
          };

          broadcast(updatedData);
        } catch (error) {
          console.error('Database error:', error);
        }
      }
    }
  } else {
    console.error('Invalid payload for DeviceZonePosition:', payload);
  }
};

module.exports = { handleZonePositionMessage };
