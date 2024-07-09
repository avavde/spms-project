const Device = require('../models/Device');
const Beacon = require('../models/Beacon');
const DeviceZonePosition = require('../models/DeviceZonePosition');
const Zone = require('../models/Zone');
const Employee = require('../models/Employee');
const ZoneEvent = require('../models/ZoneEvent');
const ZoneViolation = require('../models/ZoneViolation');
const EmployeeZoneAssignment = require('../models/EmployeeZoneAssignment');
const { broadcast } = require('../websocketServer');
const { Op, Sequelize } = require('sequelize');

// Время ожидания без сигнала от устройства для фиксации выхода из зоны (например, 5 минут)
const EXIT_TIMEOUT = 1 * 60 * 1000;

// Объект для хранения таймаутов по устройствам
const exitTimeouts = {};

async function handleZonePositionMessage(deviceId, payload) {
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
          // Попытка найти зону по маяку
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
            rssi: rssi,
            temperature: T,
            pressure: P,
            createdat: new Date(),
            updatedat: new Date()
          }, {
            conflictFields: ['device_id', 'zone_id', 'timestamp']
          });

          console.log('Zone position saved successfully');

          // Найти сотрудника по метке
          let employee = await Employee.findOne({ where: { beaconid: deviceId } });

          if (!employee) {
            console.error('Employee not found for device:', deviceId);
            continue;
          }

          // Проверка существующего события входа без соответствующего события выхода
          const existingEnterEvent = await ZoneEvent.findOne({
            where: {
              employee_id: employee.id,
              zone_id: zoneId,
              event_type: 'enter',
              duration: { [Op.is]: null }
            }
          });

          if (!existingEnterEvent) {
            // Сохранить событие входа в зону
            if (zoneId) {
              await ZoneEvent.create({
                employee_id: employee.id,
                zone_id: zoneId,
                event_type: 'enter',
                timestamp: new Date(ts * 1000)
              });

              // Проверка на нарушение зоны
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
                  timestamp: new Date(ts * 1000)
                });

                // Отправка уведомления по WebSocket
                broadcast({
                  type: 'zone_violation',
                  data: {
                    employeeId: employee.id,
                    zoneId: zoneId,
                    timestamp: new Date(ts * 1000),
                    message: 'Сотрудник вошел в запрещенную зону'
                  }
                });
              }
            }
          }

          // Удаляем таймаут выхода, если есть
          if (exitTimeouts[deviceId]) {
            clearTimeout(exitTimeouts[deviceId]);
            delete exitTimeouts[deviceId];
          }

          // Устанавливаем новый таймаут для фиксации выхода из зоны
          exitTimeouts[deviceId] = setTimeout(async () => {
            try {
              const lastEvent = await ZoneEvent.findOne({
                where: {
                  employee_id: employee.id,
                  zone_id: zoneId,
                  event_type: 'enter'
                },
                order: [['timestamp', 'DESC']]
              });

              if (lastEvent && !lastEvent.duration) {
                await ZoneEvent.create({
                  employee_id: employee.id,
                  zone_id: zoneId,
                  event_type: 'exit',
                  timestamp: new Date()
                });

                // Отправка уведомления о выходе из зоны
                broadcast({
                  type: 'zone_exit',
                  data: {
                    employeeId: employee.id,
                    zoneId: zoneId,
                    timestamp: new Date(),
                    message: 'Сотрудник вышел из зоны'
                  }
                });

                console.log(`Employee ${employee.id} exited zone ${zoneId} due to inactivity`);
              }
            } catch (error) {
              console.error('Error creating exit event:', error);
            }
          }, EXIT_TIMEOUT);

          // Подготовка данных для отправки через WebSocket
          const updatedData = {
            device_id: deviceId,
            beacon_id: bInst,
            zone_id: zoneId,
            rssi: rssi,
            timestamp: new Date(ts * 1000),
            employee: `${employee.last_name} ${employee.first_name[0]}. ${employee.middle_name[0]}.`
          };

          // Отправка данных через WebSocket
          broadcast(updatedData);
        } catch (error) {
          console.error('Database error:', error);
        }
      }
    }
  } else {
    console.error('Invalid payload for DeviceZonePosition:', payload);
  }
}

module.exports = { handleZonePositionMessage };
