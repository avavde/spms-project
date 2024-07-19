;const { Zone, Employee, EmployeeZone } = require('../models');

// Получить все EmployeeZone
exports.getAllEmployeeZones = async (req, res) => {
  try {
    const employeeZones = await EmployeeZone.findAll({ include: [Employee, Zone] });
    res.json(employeeZones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получить EmployeeZone по ID
exports.getEmployeeZoneById = async (req, res) => {
  try {
    const employeeZone = await EmployeeZone.findByPk(req.params.id, { include: [Employee, Zone] });
    if (employeeZone) {
      res.json(employeeZone);
    } else {
      res.status(404).json({ error: 'EmployeeZone not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Создать новый EmployeeZone
exports.createEmployeeZone = async (req, res) => {
  try {
    const employeeZone = await EmployeeZone.create(req.body);
    res.status(201).json(employeeZone);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Обновить EmployeeZone
exports.updateEmployeeZone = async (req, res) => {
  try {
    const [updated] = await EmployeeZone.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedEmployeeZone = await EmployeeZone.findByPk(req.params.id, { include: [Employee, Zone] });
      res.json(updatedEmployeeZone);
    } else {
      res.status(404).json({ error: 'EmployeeZone not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Удалить EmployeeZone
exports.deleteEmployeeZone = async (req, res) => {
  try {
    const deleted = await EmployeeZone.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'EmployeeZone not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
