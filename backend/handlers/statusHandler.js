const Device = require('../models/Device');
const DeviceStatus = require('../models/DeviceStatus');
const Employee = require('../models/Employee');
const { broadcast } = require('../websocketServer');

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

      // Найти сотрудника по метке
      let employee = await Employee.findOne({ where: { beaconid: deviceId } });

      if (!employee) {
        console.error('Employee not found for device:', deviceId);
        return;
      }

      // Подготовка данных для отправки через WebSocket
      const statusMessages = [];

      if (battery <= 20) {
        statusMessages.push({
          type: 'device_status',
          data: {
            employee: `${employee.last_name} ${employee.first_name[0]}. ${employee.middle_name[0]}.`,
            event: 'low_battery',
            timestamp: new Date(ts * 1000).toLocaleString(),
            message: 'Низкий заряд батареи'
          }
        });
      }

      if (sos) {
        statusMessages.push({
          type: 'device_status',
          data: {
            employee: `${employee.last_name} ${employee.first_name[0]}. ${employee.middle_name[0]}.`,
            event: 'sos_signal',
            timestamp: new Date(ts * 1000).toLocaleString(),
            message: 'Активирован SOS сигнал'
          }
        });
      }

      // Отправка данных через WebSocket
      statusMessages.forEach((msg) => broadcast(msg));
    } catch (error) {
      console.error('Database error:', error);
    }
  } else {
    console.error('Invalid payload for Device status:', payload);
  }
}

module.exports = { handleStatusMessage };
