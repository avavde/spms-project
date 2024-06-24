const Employee = require('../models/Employee');
const Department = require('../models/Department');

// Получить всех сотрудников
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({ include: Department });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получить сотрудника по ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id, { include: Department });
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Создать нового сотрудника
exports.createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Обновить сотрудника
exports.updateEmployee = async (req, res) => {
  try {
    const [updated] = await Employee.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedEmployee = await Employee.findByPk(req.params.id, { include: Department });
      res.json(updatedEmployee);
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Удалить сотрудника
exports.deleteEmployee = async (req, res) => {
  try {
    const deleted = await Employee.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
