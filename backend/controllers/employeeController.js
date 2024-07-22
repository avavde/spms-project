

const { Op } = require('sequelize');
const { Employee, ZoneEvent, Zone } = require('../models');

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.json(employees);
  } catch (error) {
    console.error('Ошибка при получении сотрудников:', error.message, error.stack);
    res.status(500).json({ error: 'Ошибка при получении сотрудников' });
  }
};

exports.getEmployeeMovements = async (req, res) => {
  const { startDate, endDate } = req.query;
  const { id } = req.params;

 
  try {
    console.log(`Fetching employee by ID: ${id}`);
    const employee = await Employee.findByPk(id);
    if (!employee) {
      console.error('Employee not found:', id);
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Добавление одного дня к endDate
    const endDatePlusOne = new Date(endDate);
    endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);

    console.log('Fetching ZoneEvents for employee:', {
      id,
      startDate,
      endDatePlusOne,
    });

    const events = await ZoneEvent.findAll({
      where: {
        employee_id: id,
        timestamp: {
          [Op.between]: [new Date(startDate), endDatePlusOne],
        },
      },
      include: [Zone],
      order: [['timestamp', 'ASC']],
    });

    console.log('Events fetched:', events.length);

    const movements = events.map((event) => ({
      timestamp: event.timestamp,
      zoneName: event.Zone ? event.Zone.name : 'Zone not found',
      zoneType: event.Zone ? event.Zone.type : 'Zone not found',
      eventType: event.event_type,
      duration: event.duration,
    }));

    console.log('Movements mapped:', movements.length);

    res.json(movements);
  } catch (error) {
    console.error('Error fetching employee movements:', error);
    res.status(500).json({ error: 'Internal server error' });
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

exports.getEmployeeLocation = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id, {
      include: [
        { model: Department, attributes: ['name'] }
      ]
    });

    if (!employee) {
      console.log('Employee not found:', req.params.id); // Отладка
      return res.status(404).json({ error: 'Employee not found' });
    }

    let locationData;
    const gnssPosition = await GNSSPosition.findOne({
      where: { device_id: employee.beaconid },
      order: [['timestamp', 'DESC']]
    });

    if (gnssPosition) {
      console.log('GNSS position found:', gnssPosition); // Отладка
      locationData = {
        gps: true,
        coordinates: [gnssPosition.latitude, gnssPosition.longitude],
      };
    } else {
      const deviceZonePosition = await DeviceZonePosition.findOne({
        where: { device_id: employee.beaconid },
        order: [['timestamp', 'DESC']]
      });

      if (deviceZonePosition) {
        const zone = await Zone.findByPk(deviceZonePosition.zone_id);
        const beacon = await Beacon.findOne({ where: { beacon_mac: deviceZonePosition.device_id } });

        console.log('Device zone position found:', deviceZonePosition); // Отладка
        console.log('Zone found:', zone); // Отладка
        console.log('Beacon found:', beacon); // Отладка

        locationData = {
          gps: false,
          coordinates: beacon ? beacon.map_coordinates : [0, 0],
          zone,
          mapUrl: '/path/to/plan.jpg'
        };
      } else {
        console.log('No device zone position found'); // Отладка
      }
    }

    if (!locationData) {
      return res.status(404).json({ error: 'Location data not found' });
    }

    const fullName = `${employee.last_name} ${employee.first_name} ${employee.middle_name}`;
    const position = employee.position || 'Не указано';
    const department = employee.Department ? employee.Department.name : 'Не указано';

    const result = {
      ...locationData,
      full_name: fullName,
      position: position,
      department: department
    };

    console.log('Location data:', result); // Отладка
    res.json(result);
  } catch (error) {
    console.error('Error fetching employee location:', error.message, error.stack); // Улучшенное логирование
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};