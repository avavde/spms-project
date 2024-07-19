const { Department } = require('../models');

// Получение всех отделов
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll();
    res.json(departments);
  } catch (error) {
    console.error('Ошибка при получении отделов:', error);
    res.status(500).json({ error: 'Ошибка при получении отделов' });
  }
};

// Получение отдела по ID
exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) {
      return res.status(404).json({ error: 'Отдел не найден' });
    }
    res.json(department);
  } catch (error) {
    console.error('Ошибка при получении отдела:', error);
    res.status(500).json({ error: 'Ошибка при получении отдела' });
  }
};

// Создание нового отдела
exports.createDepartment = async (req, res) => {
  try {
    const newDepartment = await Department.create(req.body);
    res.status(201).json(newDepartment);
  } catch (error) {
    console.error('Ошибка при создании отдела:', error);
    res.status(500).json({ error: 'Ошибка при создании отдела' });
  }
};

// Обновление отдела
exports.updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) {
      return res.status(404).json({ error: 'Отдел не найден' });
    }
    await department.update(req.body);
    res.json(department);
  } catch (error) {
    console.error('Ошибка при обновлении отдела:', error);
    res.status(500).json({ error: 'Ошибка при обновлении отдела' });
  }
};

// Удаление отдела
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) {
      return res.status(404).json({ error: 'Отдел не найден' });
    }
    await department.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Ошибка при удалении отдела:', error);
    res.status(500).json({ error: 'Ошибка при удалении отдела' });
  }
};
