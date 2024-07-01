const Beacon = require('../models/Beacon');

exports.getAvailableBeacons = async (req, res) => {
  try {
    const beacons = await Beacon.findAll({ where: { devicetype: 'badge', employeeId: null } });
    res.json(beacons);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении доступных меток' });
  }
};
