const Movement = require('../models/Movement');
const Device = require('../models/Device');

// Получить все передвижения
exports.getAllMovements = async (req, res) => {
  try {
    const movements = await Movement.findAll({ include: Device });
    res.json(movements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получить передвижение по ID
exports.getMovementById = async (req, res) => {
  try {
    const movement = await Movement.findByPk(req.params.id, { include: Device });
    if (movement) {
      res.json(movement);
    } else {
      res.status(404).json({ error: 'Movement not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Создать новое передвижение
exports.createMovement = async (req, res) => {
  try {
    const movement = await Movement.create(req.body);
    res.status(201).json(movement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Обновить передвижение
exports.updateMovement = async (req, res) => {
  try {
    const [updated] = await Movement.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedMovement = await Movement.findByPk(req.params.id, { include: Device });
      res.json(updatedMovement);
    } else {
      res.status(404).json({ error: 'Movement not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Удалить передвижение
exports.deleteMovement = async (req, res) => {
  try {
    const deleted = await Movement.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Movement not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
