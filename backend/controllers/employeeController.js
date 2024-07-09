const Employee = require('../models/Employee');
const Beacon = require('../models/Beacon');

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.json(employees);
  } catch (error) {
    console.error('Ошибка при получении сотрудников:', error.message, error.stack);
    res.status(500).json({ error: 'Ошибка при получении сотрудников' });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Сотрудник не найден' });
    }
    res.json(employee);
  } catch (error) {
    console.error('Ошибка при получении сотрудника:', error.message, error.stack);
    res.status(500).json({ error: 'Ошибка при получении сотрудника' });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const { first_name, last_name, middle_name, email, phone, department_id, position, beaconid } = req.body;

    // Логирование входящих данных
    console.log('Received data for new employee:', req.body);

    // Проверка обязательных полей
    if (!first_name || !last_name || !phone) {
      return res.status(400).json({ error: 'Пожалуйста, заполните все обязательные поля' });
    }

    // Если department_id пустой, установите его в null
    const deptId = department_id === '' ? null : department_id;

    const newEmployee = await Employee.create({
      first_name,
      last_name,
      middle_name,
      email, // email остается необязательным
      phone,
      department_id: deptId,
      position,
      beaconid,
    });
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error('Ошибка при создании сотрудника:', error.message, error.stack);
    res.status(500).json({ error: 'Ошибка при создании сотрудника' });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { first_name, last_name, middle_name, email, phone, department_id, position, beaconid } = req.body;

    // Логирование входящих данных
    console.log('Received data for updating employee:', req.body);

    // Если department_id пустой, установите его в null
    const deptId = department_id === '' ? null : department_id;

    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      console.log('Employee not found:', req.params.id); // Логируем, если сотрудник не найден
      return res.status(404).json({ error: 'Сотрудник не найден' });
    }

    console.log('Updating employee with id:', req.params.id); // Добавлено для отладки

    // Обновление данных сотрудника
    const updatedEmployee = await employee.update({
      first_name,
      last_name,
      middle_name,
      email, // email остается необязательным
      phone,
      department_id: deptId,
      position,
      beaconid
    }, {
      fields: ['first_name', 'last_name', 'middle_name', 'email', 'phone', 'department_id', 'position', 'beaconid'] // Явное указание изменяемых полей
    });

    console.log('Employee updated successfully:', updatedEmployee); // Логирование обновленного сотрудника
    res.json(updatedEmployee);
  } catch (error) {
    console.error('Ошибка при обновлении сотрудника:', error.message, error.stack);
    res.status(500).json({ error: 'Ошибка при обновлении сотрудника' });
  }
};


exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Сотрудник не найден' });
    }
    await employee.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Ошибка при удалении сотрудника:', error.message, error.stack);
    res.status(500).json({ error: 'Ошибка при удалении сотрудника' });
  }
};

exports.assignBeacon = async (req, res) => {
  const { id } = req.params;
  const { beaconid } = req.body;

  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ error: 'Сотрудник не найден' });
    }

    const beacon = await Beacon.findByPk(beaconid);
    if (!beacon) {
      return res.status(404).json({ error: 'Метка не найдена' });
    }

    employee.beaconid = beaconid;
    await employee.save();

    res.json(employee);
  } catch (error) {
    console.error('Ошибка при назначении метки:', error.message, error.stack);
    res.status(500).json({ error: 'Ошибка при назначении метки' });
  }
};
