const Device = require('../models/Device');
const Employee = require('../models/Employee')
const { broadcast } = require('../websocketServer');

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

      // Найти сотрудника по метке
      let employee = await Employee.findOne({ where: { beaconid: deviceId } });

      if (!employee) {
        console.error('Employee not found for device:', deviceId);
        return;
      }

      // Подготовка данных для отправки через WebSocket
      const deviceInfo = {
        type: 'device_status',
        data: {
          employee_id: employee.id, // ID сотрудника
          employee: `${employee.last_name} ${employee.first_name[0]}. ${employee.middle_name[0]}.`,
          fw_version: fw_version || '',
          nfc_uid: nfc_uid || '',
          imei: imei || '',
          mac_uwb: mac_uwb || '',
          ip: ip || '',
          timestamp: new Date().toISOString()
        }
      };

      // Отправка данных через WebSocket
      broadcast(deviceInfo);
    } catch (error) {
      console.error('Database error:', error);
    }
  } else {
    console.error('Invalid payload for Device:', payload);
  }
}

module.exports = { handleDeviceInfoMessage };
