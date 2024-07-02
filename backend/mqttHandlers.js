const Device = require('./models/Device');
const Beacon = require('./models/Beacon');
const DeviceZonePosition = require('./models/DeviceZonePosition');
const GNSSPosition = require('./models/GNSSPosition');
const DeviceStatus = require('./models/DeviceStatus');
const DeviceEvent = require('./models/DeviceEvent');
const DeviceSelfTest = require('./models/DeviceSelfTest');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function handleDeviceInfoMessage(deviceId, payload) {
  if (payload.message) {
    const { fw_version, nfc_uid, imei, mac_uwb, ip } = payload.message;
    try {
      await Device.upsert({
        id: deviceId,
        fw_version: fw_version || '',
        nfc_uid: nfc_uid || '',
        imei: imei || '',
        mac_uwb: mac_uwb || '',
        ip: ip || '',
        devicetype: 'badge',
        createdat: new Date(),
        updatedat: new Date()
      });
      console.log('Device info saved successfully');
    } catch (error) {
      console.error('Database error:', error);
    }
  } else {
    console.error('Invalid payload for Device:', payload);
  }
}

async function handleStatusMessage(deviceId, payload) {
  if (payload.message) {
    const { ts, battery, sos, gps, beacons } = payload.message;
    console.log(`Device ${deviceId} status: battery=${battery}, sos=${sos}, gps=${gps}, beacons=${beacons}`);
    try {
      await Device.upsert({
        id: deviceId,
        devicetype: 'badge',
        createdat: new Date(),
        updatedat: new Date()
      });
      await DeviceStatus.upsert({
        device_id: deviceId,
        timestamp: new Date(ts * 1000),
        battery: battery,
        sos: sos,
        gps: gps,
        beacons: beacons,
        createdat: new Date(),
        updatedat: new Date()
      }, {
        conflictFields: ['device_id', 'timestamp']
      });
      console.log('Device status saved successfully');
    } catch (error) {
      console.error('Database error:', error);
    }
  } else {
    console.error('Invalid payload for Device status:', payload);
  }
}

async function handleGNSSPositionMessage(deviceId, payload) {
  if (payload.message && payload.message.coordinates) {
    const { ts, coordinates, sat_quantity, HDOP, VDOP } = payload.message;
    try {
      await Device.upsert({
        id: deviceId,
        devicetype: 'badge',
        createdat: new Date(),
        updatedat: new Date()
      });
      await GNSSPosition.upsert({
        device_id: deviceId,
        timestamp: new Date(ts * 1000),
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        height: coordinates.height,
        sat_quantity: sat_quantity,
        hdop: HDOP,
        vdop: VDOP,
        createdat: new Date(),
        updatedat: new Date()
      }, {
        conflictFields: ['device_id', 'timestamp']
      });
      console.log('GNSS position saved successfully');
    } catch (error) {
      console.error('Database error:', error);
    }
  } else {
    console.error('Invalid payload for GNSSPosition:', payload);
  }
}

async function handleZonePositionMessage(deviceId, payload) {
  if (!deviceId) {
    console.error('deviceId is null or undefined:', deviceId);
    return;
  }
  console.log('Processing message for device:', deviceId);

  if (payload.message) {
    for (const key in payload.message) {
      if (payload.message.hasOwnProperty(key)) {
        const { ts, bMac, rssi, T, P } = payload.message[key];

        if (!bMac) {
          console.error('bMac is null or undefined:', bMac);
          continue;
        }

        // Проверяем наличие устройства с devicetype = 'beacon'
        let beaconDevice;
        try {
          beaconDevice = await Device.findByPk(bMac);
          if (!beaconDevice) {
            beaconDevice = await Device.create({
              id: bMac,
              devicetype: 'beacon',
              createdat: new Date(),
              updatedat: new Date()
            });
            console.log('New beacon device created successfully:', bMac);
          }
        } catch (error) {
          console.error('Database error while creating beacon:', error);
          continue; // Перейти к следующему маяку
        }

        // Создаем запись в таблице beacons, если она отсутствует
        try {
          await Beacon.findOrCreate({
            where: { beacon_mac: bMac },
            defaults: {
              zone_id: null,  // Убедитесь, что zone_id может быть NULL
              map_coordinates: null,
              gps_coordinates: null
            }
          });
          console.log('Beacon record created or found successfully:', bMac);
        } catch (error) {
          console.error('Database error while creating beacon record:', error);
          continue; // Перейти к следующему маяку
        }

        // Проверяем наличие устройства с device_id
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
          continue; // Перейти к следующему маяку
        }

        try {
          await DeviceZonePosition.upsert({
            device_id: deviceId,
            zone_id: null,  // Убедитесь, что zone_id может быть NULL
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
        } catch (error) {
          console.error('Database error:', error);
        }
      }
    }
  } else {
    console.error('Invalid payload for DeviceZonePosition:', payload);
  }
}



async function handleEventMessage(deviceId, payload) {
  if (payload.message) {
    const { ts, event, sync } = payload.message;
    console.log(`Device ${deviceId} event: ts=${ts}, event=${event}, sync=${sync}`);
    try {
      await Device.upsert({
        id: deviceId,
        devicetype: 'badge',
        createdat: new Date(),
        updatedat: new Date()
      });
      await DeviceEvent.upsert({
        device_id: deviceId,
        timestamp: new Date(ts * 1000),
        event: event,
        sync: sync,
        createdat: new Date(),
        updatedat: new Date()
      }, {
        conflictFields: ['device_id', 'timestamp']
      });
      console.log('Event saved successfully');
    } catch (error) {
      console.error('Database error:', error);
    }
  } else {
    console.error('Invalid payload for Event:', payload);
  }
}

async function handleSelfTestMessage(deviceId, payload) {
  if (payload.message === 'OK') {
    console.log(`Device ${deviceId} self-test passed`);
    try {
      await Device.upsert({
        id: deviceId,
        devicetype: 'badge',
        createdat: new Date(),
        updatedat: new Date()
      });
      await DeviceSelfTest.upsert({
        device_id: deviceId,
        result: 'OK',
        createdat: new Date(),
        updatedat: new Date()
      }, {
        conflictFields: ['device_id']
      });
      console.log('Self-test saved successfully');
    } catch (error) {
      console.error('Database error:', error);
    }
  } else {
    console.error('Invalid payload for Self Test:', payload);
  }
}

async function handleNMEAMessage(topic, message) {
  const deviceId = topic.split('/')[1];
  console.log(`NMEA message received from device ${deviceId}: ${message}`);
  // Здесь можно добавить логику обработки NMEA сообщений, если это необходимо
}

module.exports = {
  handleDeviceInfoMessage,
  handleStatusMessage,
  handleGNSSPositionMessage,
  handleZonePositionMessage,
  handleEventMessage,
  handleSelfTestMessage,
  handleNMEAMessage
};
