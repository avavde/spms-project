const Device = require('../models/Device');
const Beacon = require('../models/Beacon');
const DeviceZonePosition = require('../models/DeviceZonePosition');
const Zone = require('../models/Zone');
const Employee = require('../models/Employee');
const { broadcast } = require('../websocketServer');
const { Op, Sequelize } = require('sequelize');

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
          const zonePosition = await DeviceZonePosition.upsert({
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

          // Подготовка данных для отправки через WebSocket
          const updatedData = {
            device_id: deviceId,
            beacon_id: bInst,
            zone_id: zoneId,
            rssi: rssi,
            timestamp: new Date(ts * 1000),
            employee: employee ? `${employee.last_name} ${employee.first_name[0]}. ${employee.middle_name[0]}.` : `Guest ID: ${deviceId}`
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
