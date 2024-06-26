const mqtt = require('mqtt');
const { Pool } = require('pg');
require('dotenv').config();
const { broadcast } = require('./websocketServer');
const DeviceZonePosition = require('./models/DeviceZonePosition');
const Device = require('./models/Device');
const GNSSPosition = require('./models/GNSSPosition');
const DeviceStatus = require('./models/DeviceStatus');
const DeviceEvent = require('./models/DeviceEvent');
const DeviceSelfTest = require('./models/DeviceSelfTest');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const client = mqtt.connect({
  host: process.env.MQTT_HOST,
  port: process.env.MQTT_PORT,
  protocol: 'mqtt',
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
});

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('BADGE/#', (err) => {
    if (!err) {
      console.log('Subscribed to BADGE topic and all its subtopics');
    } else {
      console.error('Subscription error:', err);
    }
  });
});

client.on('message', async (topic, message) => {
  try {
    const messageString = message.toString();

    if (messageString.startsWith('$')) {
      handleNMEAMessage(topic, messageString);
      return;
    }

    let payload;
    try {
      payload = JSON.parse(messageString);
    } catch (error) {
      console.error('JSON parsing error:', error);
      console.error('Original message:', messageString);
      return;
    }

    const deviceId = topic.split('/')[1];
    console.log('Parsed payload:', payload);

    if (topic.includes('/up/dev_info')) {
      await handleDeviceInfoMessage(deviceId, payload);
    } else if (topic.includes('/up/statuses')) {
      await handleStatusMessage(deviceId, payload);
    } else if (topic.includes('/up/gnss_position')) {
      await handleGNSSPositionMessage(deviceId, payload);
    } else if (topic.includes('/up/zone_position')) {
      await handleZonePositionMessage(deviceId, payload);
    } else if (topic.includes('/up/events')) {
      await handleEventMessage(deviceId, payload);
    } else if (topic.includes('/up/self_test')) {
      await handleSelfTestMessage(deviceId, payload);
    } else {
      console.error('Unknown topic:', topic);
    }
  } catch (error) {
    console.error('Error handling MQTT message:', error);
  }
});

async function handleDeviceInfoMessage(deviceId, payload) {
  if (payload.message) {
    const { fw_version, nfc_uid, imei, mac_uwb, ip } = payload.message;
    try {
      const [device, created] = await Device.upsert({
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
      console.log('Device info saved successfully', device);
      if (created) {
        console.log('New device created');
      } else {
        console.log('Existing device updated');
      }
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
      const deviceExists = await Device.findByPk(deviceId);
      if (!deviceExists) {
        await Device.upsert({
          id: deviceId,
          createdat: new Date(),
          updatedat: new Date()
        });
      }

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
  if (payload.message) {
    for (const key in payload.message) {
      if (payload.message.hasOwnProperty(key)) {
        const { ts, bMac, rssi, T, P } = payload.message[key];

        // Проверяем наличие устройства с devicetype = 'beacon'
        const beaconExists = await Device.findByPk(bMac);

        if (!beaconExists) {
          // Создаем новое устройство с devicetype = 'beacon'
          try {
            await Device.create({
              id: bMac,
              devicetype: 'beacon',
              createdat: new Date(),
              updatedat: new Date()
            });
            console.log('New beacon device created successfully');
          } catch (error) {
            console.error('Database error while creating beacon:', error);
          }
        }

        const zone = await getZoneByBeaconMac(bMac);

        if (zone) {
          try {
            await DeviceZonePosition.upsert({
              device_id: bMac,
              zone_id: zone.id,
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
        } else {
          console.error('Zone not found for beacon:', bMac);
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

async function getZoneByBeaconMac(beaconMac) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM beacons WHERE beacon_mac = $1', [beaconMac]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

module.exports = client;
