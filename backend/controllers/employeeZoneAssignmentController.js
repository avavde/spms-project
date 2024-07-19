const { Zone, Employee, EmployeeZoneAssignment } = require('../models');

// Получить все назначения зон для сотрудников
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await EmployeeZoneAssignment.findAll({ include: [Employee, Zone] });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получить назначение по ID
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await EmployeeZoneAssignment.findByPk(req.params.id, { include: [Employee, Zone] });
    if (assignment) {
      res.json(assignment);
    } else {
      res.status(404).json({ error: 'Assignment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получить назначения для конкретного сотрудника по employeeId
exports.getAssignmentByEmployeeId = async (req, res) => {
  try {
    const assignments = await EmployeeZoneAssignment.findAll({ where: { employee_id: req.params.employeeId }, include: [Zone] });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Создать новое назначение зоны для сотрудника
exports.createAssignment = async (req, res) => {
  try {
    const existingAssignment = await EmployeeZoneAssignment.findOne({ where: { employee_id: req.body.employee_id, zone_id: req.body.zone_id } });
    if (existingAssignment) {
      return res.status(400).json({ error: 'Assignment already exists' });
    }
    const assignment = await EmployeeZoneAssignment.create(req.body);
    res.status(201).json(assignment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Обновить назначение зоны для сотрудника
exports.updateAssignment = async (req, res) => {
  try {
    const [updated] = await EmployeeZoneAssignment.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedAssignment = await EmployeeZoneAssignment.findByPk(req.params.id, { include: [Employee, Zone] });
      res.json(updatedAssignment);
    } else {
      res.status(404).json({ error: 'Assignment not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Удалить назначение зоны для сотрудника
exports.deleteAssignment = async (req, res) => {
  try {
    const deleted = await EmployeeZoneAssignment.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Assignment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
