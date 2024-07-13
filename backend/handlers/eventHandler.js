const Device = require('../models/Device');
const DeviceEvent = require('../models/DeviceEvent');
const Employee = require('../models/Employee');
const { broadcast } = require('../websocketServer');

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

      // Найти сотрудника по метке
      let employee = await Employee.findOne({ where: { beaconid: deviceId } });

      if (!employee) {
        console.error('Employee not found for device:', deviceId);
        return;
      }

      // Подготовка данных для отправки через WebSocket
      const updatedData = {
        type: 'device_event',
        data: {
          employee: `${employee.last_name} ${employee.first_name[0]}. ${employee.middle_name[0]}.`,
          event: event,
          timestamp: new Date(ts * 1000).toLocaleString(),
          message: `Событие: ${event}`
        }
      };

      // Отправка данных через WebSocket
      broadcast(updatedData);
    } catch (error) {
      console.error('Database error:', error);
    }
  } else {
    console.error('Invalid payload for Event:', payload);
  }
}

module.exports = { handleEventMessage };
