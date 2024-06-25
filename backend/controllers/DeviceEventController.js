const DeviceEvent = require('../models/DeviceEvent');

exports.getAllDeviceEvents = async (req, res) => {
  try {
    const events = await DeviceEvent.findAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDeviceEvent = async (req, res) => {
  try {
    const event = await DeviceEvent.findByPk(req.params.id);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ error: 'Device event not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};