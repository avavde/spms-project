const Zone = require('../models/Zone');

exports.getAllZones = async (req, res) => {
  try {
    const zones = await Zone.findAll();
    res.json(zones);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении зон' });
  }
};

exports.getZoneById = async (req, res) => {
  try {
    const zone = await Zone.findByPk(req.params.id);
    if (!zone) {
      return res.status(404).json({ error: 'Зона не найдена' });
    }
    res.json(zone);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении зоны' });
  }
};

exports.createZone = async (req, res) => {
  try {
    const { name, coordinates, beacons, type } = req.body;
    const newZone = await Zone.create({ name, coordinates, beacons, type });
    res.status(201).json(newZone);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании зоны' });
  }
};

exports.updateZone = async (req, res) => {
  try {
    const { name, coordinates, beacons, type } = req.body;
    const zone = await Zone.findByPk(req.params.id);
    if (!zone) {
      return res.status(404).json({ error: 'Зона не найдена' });
    }
    await zone.update({ name, coordinates, beacons, type });
    res.json(zone);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении зоны' });
  }
};

exports.deleteZone = async (req, res) => {
  try {
    const zone = await Zone.findByPk(req.params.id);
    if (!zone) {
      return res.status(404).json({ error: 'Зона не найдена' });
    }
    await zone.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении зоны' });
  }
};
