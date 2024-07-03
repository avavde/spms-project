const mqtt = require('mqtt');
const { handleDeviceInfoMessage } = require('./handlers/deviceHandler');
const { handleStatusMessage } = require('./handlers/statusHandler');
const { handleGNSSPositionMessage } = require('./handlers/gnssHandler');
const { handleZonePositionMessage } = require('./handlers/zoneHandler'); // Проверяем правильность импорта
const { handleEventMessage } = require('./handlers/eventHandler');
const { handleSelfTestMessage } = require('./handlers/selfTestHandler');
const { handleNMEAMessage } = require('./handlers/nmeaHandler');

const client = mqtt.connect(process.env.MQTT_BROKER_URL);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('#');
});

client.on('message', async (topic, message) => {
  const payload = JSON.parse(message.toString());
  console.log(`Received MQTT message on topic ${topic}`);
  console.log(`Parsed payload: ${JSON.stringify(payload)}`);

  try {
    if (topic.includes('deviceInfo')) {
      await handleDeviceInfoMessage(topic.split('/')[1], payload);
    } else if (topic.includes('status')) {
      await handleStatusMessage(topic.split('/')[1], payload);
    } else if (topic.includes('gnssPosition')) {
      await handleGNSSPositionMessage(topic.split('/')[1], payload);
    } else if (topic.includes('zonePosition')) {
      await handleZonePositionMessage(topic.split('/')[1], payload); // Проверяем вызов функции
    } else if (topic.includes('event')) {
      await handleEventMessage(topic.split('/')[1], payload);
    } else if (topic.includes('selfTest')) {
      await handleSelfTestMessage(topic.split('/')[1], payload);
    } else if (topic.includes('nmea')) {
      await handleNMEAMessage(topic, message.toString());
    }
  } catch (error) {
    console.error('Error handling MQTT message:', error);
  }
});
