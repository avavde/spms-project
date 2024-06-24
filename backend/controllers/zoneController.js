const Zone = require('../models/Zone');
const Department = require('../models/Department');

// Получить все зоны
exports.getAllZones = async (req, res) => {
  try {
    const zones = await Zone.findAll({ include: Department });
    res.json(zones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получить зону по ID
exports.getZoneById = async (req, res) => {
  try {
    const zone = await Zone.findByPk(req.params.id, { include: Department });
    if (zone) {
      res.json(zone);
    } else {
      res.status(404).json({ error: 'Zone not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Создать новую зону
exports.createZone = async (req, res) => {
  try {
    const zone = await Zone.create(req.body);
    res.status(201).json(zone);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Обновить зону
exports.updateZone = async (req, res) => {
  try {
    const [updated] = await Zone.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedZone = await Zone.findByPk(req.params.id, { include: Department });
      res.json(updatedZone);
    } else {
      res.status(404).json({ error: 'Zone not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Удалить зону
exports.deleteZone = async (req, res) => {
  try {
    const deleted = await Zone.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Zone not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
