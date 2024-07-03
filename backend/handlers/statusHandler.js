const Device = require('../models/Device');
const DeviceStatus = require('../models/DeviceStatus');

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

module.exports = { handleStatusMessage };
