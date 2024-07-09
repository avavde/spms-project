const ZoneEvent = require('../models/ZoneEvent');
const ZoneViolation = require('../models/ZoneViolation');

const handleZoneEvent = async (employeeId, zoneId, eventType) => {
  try {
    const event = await ZoneEvent.create({
      employee_id: employeeId,
      zone_id: zoneId,
      event_type: eventType,
      timestamp: new Date()
    });

    if (eventType === 'exit') {
      const enterEvent = await ZoneEvent.findOne({
        where: {
          employee_id: employeeId,
          zone_id: zoneId,
          event_type: 'enter'
        },
        order: [['timestamp', 'DESC']]
      });

      if (enterEvent) {
        const duration = Math.floor((new Date() - new Date(enterEvent.timestamp)) / 1000);
        event.duration = duration;
        await event.save();

        const zoneViolation = await ZoneViolation.findOne({ where: { employee_id: employeeId, zone_type: 'forbidden' } });
        if (zoneViolation && zoneViolation.zones.includes(zoneId)) {
          zoneViolation.violation_count += 1;
          zoneViolation.time_spent += duration;
          await zoneViolation.save();
        } else {
          const zoneType = zoneViolation && zoneViolation.zones.includes(zoneId) ? 'allowed' : 'workplace';
          const updateZoneViolation = await ZoneViolation.findOne({ where: { employee_id: employeeId, zone_type: zoneType } });
          if (updateZoneViolation) {
            updateZoneViolation.time_spent += duration;
            updateZoneViolation.last_updated = new Date();
            await updateZoneViolation.save();
          } else {
            await ZoneViolation.create({
              employee_id: employeeId,
              zone_type: zoneType,
              zones: [zoneId],
              time_spent: duration,
              violation_count: 0,
              last_updated: new Date()
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error handling zone event:', error);
  }
};

module.exports = {
  handleZoneEvent,
};
