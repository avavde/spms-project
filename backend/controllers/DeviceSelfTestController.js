const { DeviceSelfTest } = require('../models');

exports.getAllDeviceSelfTests = async (req, res) => {
  try {
    const tests = await DeviceSelfTest.findAll();
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDeviceSelfTest = async (req, res) => {
  try {
    const test = await DeviceSelfTest.findByPk(req.params.id);
    if (test) {
      res.json(test);
    } else {
      res.status(404).json({ error: 'Device self-test not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
