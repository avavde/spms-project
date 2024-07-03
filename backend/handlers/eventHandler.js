const Device = require('../models/Device');
const DeviceEvent = require('../models/DeviceEvent');

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

module.exports = { handleEventMessage };
