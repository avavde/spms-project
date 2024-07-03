const Device = require('../models/Device');
const DeviceSelfTest = require('../models/DeviceSelfTest');

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

module.exports = { handleSelfTestMessage };
