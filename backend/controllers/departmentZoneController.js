const DepartmentZone = require('../models/DepartmentZone');
const Department = require('../models/Department');
const Zone = require('../models/Zone');

// Получить все DepartmentZone
exports.getAllDepartmentZones = async (req, res) => {
  try {
    const departmentZones = await DepartmentZone.findAll({ include: [Department, Zone] });
    res.json(departmentZones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получить DepartmentZone по ID
exports.getDepartmentZoneById = async (req, res) => {
  try {
    const departmentZone = await DepartmentZone.findByPk(req.params.id, { include: [Department, Zone] });
    if (departmentZone) {
      res.json(departmentZone);
    } else {
      res.status(404).json({ error: 'DepartmentZone not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Создать новый DepartmentZone
exports.createDepartmentZone = async (req, res) => {
  try {
    const departmentZone = await DepartmentZone.create(req.body);
    res.status(201).json(departmentZone);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Обновить DepartmentZone
exports.updateDepartmentZone = async (req, res) => {
  try {
    const [updated] = await DepartmentZone.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedDepartmentZone = await DepartmentZone.findByPk(req.params.id, { include: [Department, Zone] });
      res.json(updatedDepartmentZone);
    } else {
      res.status(404).json({ error: 'DepartmentZone not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Удалить DepartmentZone
exports.deleteDepartmentZone = async (req, res) => {
  try {
    const deleted = await DepartmentZone.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'DepartmentZone not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
