// handlers/nmeaHandler.js
async function handleNMEAMessage(topic, message) {
  const deviceId = topic.split('/')[1];
  console.log(`NMEA message received from device ${deviceId}: ${message}`);

}

module.exports = {
  handleNMEAMessage
};
