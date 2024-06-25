const mqtt = require('mqtt');
const { Pool } = require('pg');
require('dotenv').config();
const { broadcast } = require('./websocketServer');
const DeviceZonePosition = require('./models/DeviceZonePosition');
const Device = require('./models/Device');
const Movement = require('./models/Movement');
const EmployeeZone = require('./models/EmployeeZone');
const GNSSPosition = require('./models/GNSSPosition');

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
    const payload = JSON.parse(message.toString());
    console.log(payload);
    await handleMqttMessage(topic, payload);
  } catch (error) {
    console.error('Error handling MQTT message:', error);
  }
});

async function handleMqttMessage(topic, data) {
  console.log('Handling MQTT message for topic:', topic, 'with data:', data);

  let deviceId;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    if (topic.includes('/dev_info')) {
      const { fw_version, nfc_uid, imei, mac_uwb, ip } = data.message;
      const devInfoQuery = `
        INSERT INTO devices (fw_version, nfc_uid, imei, mac_uwb, ip)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (imei) DO UPDATE
        SET fw_version = EXCLUDED.fw_version,
            nfc_uid = EXCLUDED.nfc_uid,
            mac_uwb = EXCLUDED.mac_uwb,
            ip = EXCLUDED.ip
        RETURNING id
      `;
      const devInfoValues = [fw_version, nfc_uid, imei, mac_uwb, ip];
      const devInfoResult = await client.query(devInfoQuery, devInfoValues);
      deviceId = devInfoResult.rows[0].id;
      console.log('Device ID:', deviceId);
    }

    if (topic.includes('/self_test')) {
      const selfTestQuery = `
        INSERT INTO device_self_tests (device_id, result)
        VALUES ($1, $2)
      `;
      const selfTestValues = [deviceId, data.message];
      await client.query(selfTestQuery, selfTestValues);
      console.log('Self-test data saved');
    }

    if (topic.includes('/statuses')) {
      const { ts, battery, sos, gps, beacons } = data.message;
      const statusesQuery = `
        INSERT INTO device_statuses (device_id, timestamp, battery, sos, gps, beacons)
        VALUES ($1, to_timestamp($2), $3, $4, $5, $6)
      `;
      const statusesValues = [deviceId, ts, battery, sos, gps, beacons];
      await client.query(statusesQuery, statusesValues);
      console.log('Statuses data saved');
    }

    if (topic.includes('/events')) {
      const { ts, event, sync } = data.message;
      const eventsQuery = `
        INSERT INTO device_events (device_id, timestamp, event, sync)
        VALUES ($1, to_timestamp($2), $3, $4)
      `;
      const eventsValues = [deviceId, ts, event, sync];
      await client.query(eventsQuery, eventsValues);
      console.log('Events data saved');
    }

    if (topic.includes('/zone_position')) {
      const { b0 } = data.message;
      if (b0 && b0.bMac && b0.ts) {
        const zonePositionQuery = `
          INSERT INTO device_zone_positions (device_id, beacon_mac, timestamp, rssi, temperature, pressure)
          VALUES ($1, $2, to_timestamp($3), $4, $5, $6)
          ON CONFLICT (device_id, beacon_mac, timestamp) DO UPDATE
          SET rssi = EXCLUDED.rssi,
              temperature = EXCLUDED.temperature,
              pressure = EXCLUDED.pressure
        `;
        const zonePositionValues = [deviceId, b0.bMac, b0.ts, b0.rssi, b0.T, b0.P];
        await client.query(zonePositionQuery, zonePositionValues);
        console.log('Zone position data saved');
      } else {
        console.error('Invalid payload for DeviceZonePosition:', data);
      }
    }

    if (topic.includes('/gnss_position')) {
      const { ts, coordinates, sat_quantity, HDOP, VDOP } = data.message;
      if (coordinates && coordinates.latitude && coordinates.longitude && ts && sat_quantity !== undefined && HDOP !== undefined && VDOP !== undefined) {
        const gnssPositionQuery = `
          INSERT INTO device_gnss_positions (device_id, timestamp, latitude, longitude, height, sat_quantity, hdop, vdop)
          VALUES ($1, to_timestamp($2), $3, $4, $5, $6, $7, $8)
          ON CONFLICT (device_id, timestamp) DO UPDATE
          SET latitude = EXCLUDED.latitude,
              longitude = EXCLUDED.longitude,
              height = EXCLUDED.height,
              sat_quantity = EXCLUDED.sat_quantity,
              hdop = EXCLUDED.hdop,
              vdop = EXCLUDED.vdop
        `;
        const gnssPositionValues = [
          deviceId,
          ts,
          coordinates.latitude,
          coordinates.longitude,
          coordinates.height,
          sat_quantity,
          HDOP,
          VDOP,
        ];
        await client.query(gnssPositionQuery, gnssPositionValues);
        console.log('GNSS position data saved');
      } else {
        console.error('Invalid payload for GNSSPosition:', data);
      }
    }

    await client.query('COMMIT');
    console.log('Transaction committed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error handling MQTT message:', error);
  } finally {
    client.release();
  }
}

module.exports = client;
