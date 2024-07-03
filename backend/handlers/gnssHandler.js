const Device = require('../models/Device');
const GNSSPosition = require('../models/GNSSPosition');

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

module.exports = { handleGNSSPositionMessage };
