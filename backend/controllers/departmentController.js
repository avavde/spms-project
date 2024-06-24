const Department = require('../models/Department');

// Получить все отделы
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получить отдел по ID
exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (department) {
      res.json(department);
    } else {
      res.status(404).json({ error: 'Department not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Создать новый отдел
exports.createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json(department);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Обновить отдел
exports.updateDepartment = async (req, res) => {
  try {
    const [updated] = await Department.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedDepartment = await Department.findByPk(req.params.id);
      res.json(updatedDepartment);
    } else {
      res.status(404).json({ error: 'Department not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Удалить отдел
exports.deleteDepartment = async (req, res) => {
  try {
    const deleted = await Department.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Department not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
