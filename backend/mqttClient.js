// backend/mqttClient.js

const mqtt = require('mqtt');
const { Pool } = require('pg');
require('dotenv').config();
const { broadcast } = require('./websocketServer');
const { handleDeviceInfoMessage } = require('./handlers/deviceHandler');
const { handleStatusMessage } = require('./handlers/statusHandler');
const { handleGNSSPositionMessage } = require('./handlers/gnssHandler');
const { handleZonePositionMessage } = require('./handlers/zoneHandler');
const { handleEventMessage } = require('./handlers/eventHandler');
const { handleSelfTestMessage } = require('./handlers/selfTestHandler');
const { handleNMEAMessage } = require('./handlers/nmeaHandler');

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
      await handleNMEAMessage(topic, messageString);
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

const sendMessage = (topic, message) => {
  client.publish(topic, message, (error) => {
    if (error) {
      console.error('Error publishing message:', error);
    } else {
      console.log('Message published:', message);
    }
  });
};

module.exports = {
  client,
  sendMessage,
};
