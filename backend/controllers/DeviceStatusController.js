const { DeviceStatus } = require('../models');

exports.getAllDeviceStatuses = async (req, res) => {
  try {
    const statuses = await DeviceStatus.findAll();
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDeviceStatus = async (req, res) => {
  try {
    const status = await DeviceStatus.findByPk(req.params.id);
    if (status) {
      res.json(status);
    } else {
      res.status(404).json({ error: 'Device status not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
