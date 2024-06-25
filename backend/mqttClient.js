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
  const messageString = message.toString();
  console.log('Raw message:', messageString);

  if (messageString.startsWith('$')) {
    console.log('NMEA message received:', messageString);
    handleNmeaMessage(topic, messageString);
  } else {
    try {
      const payload = JSON.parse(messageString);
      console.log('Parsed payload:', payload);

      const deviceId = extractDeviceIdFromTopic(topic);

      if (!deviceId) {
        console.error('Invalid topic format. Device ID not found in topic:', topic);
        return;
      }

      if (topic.includes('up/zone_position')) {
        await handleZonePositionMessage(deviceId, payload);
      } else if (topic.includes('up/gnss_position')) {
        await handleGnssPositionMessage(deviceId, payload);
      } else if (topic.includes('up/statuses')) {
        await handleStatusMessage(deviceId, payload);
      } else if (topic.includes('up/movement')) {
        await handleMovementMessage(deviceId, payload);
      } else if (topic.includes('up/employee_zone')) {
        await handleEmployeeZoneMessage(deviceId, payload);
      }
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
    }
  }
});

function extractDeviceIdFromTopic(topic) {
  const parts = topic.split('/');
  return parts.length > 1 ? parts[1] : null;
}

async function handleZonePositionMessage(deviceId, payload) {
  const { message } = payload;

  if (message.b0 && message.b0.ts && message.b0.bMac && message.b0.rssi !== undefined && message.b0.T !== undefined && message.b0.P !== undefined) {
    const zoneId = await determineZone(message.b0.bMac);
    if (zoneId) {
      await DeviceZonePosition.upsert({
        deviceId,
        zoneId,
        timestamp: new Date(message.b0.ts * 1000),
        rssi: message.b0.rssi,
        temperature: message.b0.T,
        pressure: message.b0.P
      });
      console.log('Zone position data saved');
    } else {
      console.error('Zone not found for beacon:', message.b0.bMac);
    }
  } else {
    console.error('Invalid payload for DeviceZonePosition:', payload);
  }
}

async function determineZone(beaconMac) {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT zone_id FROM beacons WHERE beacon_mac = $1', [beaconMac]);
    return res.rows.length > 0 ? res.rows[0].zone_id : null;
  } finally {
    client.release();
  }
}

async function handleGnssPositionMessage(deviceId, payload) {
  const { message } = payload;
  if (message.ts && message.coordinates && message.coordinates.latitude && message.coordinates.longitude && message.sat_quantity && message.HDOP && message.VDOP) {
    await GNSSPosition.upsert({
      deviceId,
      timestamp: new Date(message.ts * 1000),
      latitude: message.coordinates.latitude,
      longitude: message.coordinates.longitude,
      height: message.coordinates.height,
      satQuantity: message.sat_quantity,
      hdop: message.HDOP,
      vdop: message.VDOP
    });
    console.log('GNSS position data saved');
  } else {
    console.error('Invalid payload for GNSSPosition:', payload);
  }
}

async function handleStatusMessage(deviceId, payload) {
  const { message } = payload;
  if (message.battery && message.sos !== undefined && message.gps !== undefined && message.beacons !== undefined) {
    await Device.upsert({
      id: deviceId,
      fw_version: message.fw_version,
      nfc_uid: message.nfc_uid,
      imei: message.imei,
      mac_uwb: message.mac_uwb,
      ip: message.ip,
      battery: message.battery,
      sos: message.sos,
      gps: message.gps,
      beacons: message.beacons
    });
    console.log('Statuses data saved');
  } else {
    console.error('Invalid payload for Device:', payload);
  }
}

async function handleMovementMessage(deviceId, payload) {
  const { message } = payload;
  if (message.from_zone_id && message.to_zone_id && message.timestamp) {
    await Movement.upsert({
      deviceId,
      fromZoneId: message.from_zone_id,
      toZoneId: message.to_zone_id,
      timestamp: new Date(message.timestamp * 1000)
    });
    console.log('Movement data saved');
  } else {
    console.error('Invalid payload for Movement:', payload);
  }
}

async function handleEmployeeZoneMessage(deviceId, payload) {
  const { message } = payload;
  if (message.employee_id && message.zone_id && message.timestamp) {
    await EmployeeZone.upsert({
      employeeId: message.employee_id,
      zoneId: message.zone_id,
      timestamp: new Date(message.timestamp * 1000)
    });
    console.log('Employee zone data saved');
  } else {
    console.error('Invalid payload for EmployeeZone:', payload);
  }
}

function handleNmeaMessage(topic, message) {
  console.log('Handling NMEA message for topic:', topic, 'with message:', message);
  // Add your NMEA message handling logic here
}

module.exports = client;
