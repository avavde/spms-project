const Device = require('../models/Device');

async function handleDeviceInfoMessage(deviceId, payload) {
  if (payload.message) {
    const { fw_version, nfc_uid, imei, mac_uwb, ip } = payload.message;
    try {
      await Device.upsert({
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
      console.log('Device info saved successfully');
    } catch (error) {
      console.error('Database error:', error);
    }
  } else {
    console.error('Invalid payload for Device:', payload);
  }
}

module.exports = { handleDeviceInfoMessage };
