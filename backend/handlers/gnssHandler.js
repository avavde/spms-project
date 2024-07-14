const Device = require('../models/Device');
const GNSSPosition = require('../models/GNSSPosition');
const Employee = require('../models/Employee');
const { broadcast } = require('../websocketServer');

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

      // Найти сотрудника по метке
      let employee = await Employee.findOne({ where: { beaconid: deviceId } });

      if (!employee) {
        console.error('Employee not found for device:', deviceId);
        return;
      }

      // Подготовка данных для отправки через WebSocket
      const updatedData = {
        type: 'gnss_position',
        data: {
          employee_id: employee.id, // ID сотрудника
          employee: `${employee.last_name} ${employee.first_name[0]}. ${employee.middle_name[0]}.`,
          coordinates: {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            height: coordinates.height
          },
          sat_quantity: sat_quantity,
          hdop: HDOP,
          vdop: VDOP,
          timestamp: new Date(ts * 1000).toISOString(),
          message: `GNSS позиция обновлена`
        }
      };

      // Отправка данных через WebSocket
      broadcast(updatedData);
    } catch (error) {
      console.error('Database error:', error);
    }
  } else {
    console.error('Invalid payload for GNSSPosition:', payload);
  }
}

module.exports = { handleGNSSPositionMessage };
