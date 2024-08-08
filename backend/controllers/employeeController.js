const { createLogger, transports, format } = require('winston');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const { Employee, ZoneEvent, Zone, GNSSPosition, DeviceZonePosition, Beacon } = require('../models');

const logFilePath = path.join(__dirname, '../logs/employee_log.log');

// Создаем логгер с настройками
const logger = createLogger({
  level: 'info', // Уровень логирования
  format: format.combine(
    format.timestamp(), // Добавляем временную метку
    format.json() // Формат JSON для записи логов
  ),
  transports: [
    new transports.File({ filename: logFilePath }) // Запись логов в файл
  ]
});

// Получение всех сотрудников
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.json(employees);
  } catch (error) {
    logger.error('Ошибка при получении сотрудников:', { message: error.message, stack: error.stack });
    res.status(500).json({ error: 'Ошибка при получении сотрудников' });
  }
};

// Получение перемещений сотрудника
exports.getEmployeeMovements = async (req, res) => {
  const { startDate, endDate } = req.query;
  const { id } = req.params;

  const start = startDate ? new Date(startDate) : new Date(new Date().setHours(0, 0, 0, 0));
  const end = endDate ? new Date(endDate) : new Date(new Date().setHours(23, 59, 59, 999));

  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ error: 'Сотрудник не найден' });
    }

    const events = await ZoneEvent.findAll({
      where: {
        employee_id: id,
        timestamp: {
          [Op.between]: [start, end],
        },
      },
      include: [Zone],
      order: [['timestamp', 'ASC']],
    });

    const gnssPositions = await GNSSPosition.findAll({
      where: {
        device_id: employee.beaconid,
        timestamp: {
          [Op.between]: [start, end],
        },
      },
      order: [['timestamp', 'ASC']],
    });

    const zoneDurations = {};
    const routeFrequencies = {};
    const movementTimes = {};
    let totalMovementTime = 0;
    const movements = [];
    const zoneCoordinates = {};

    events.forEach((event, index) => {
      const { zoneName, duration, timestamp, eventType } = event;

      if (event.Zone) {
        zoneCoordinates[zoneName] = event.Zone.coordinates;

        if (!zoneDurations[zoneName]) {
          zoneDurations[zoneName] = 0;
        }
        if (duration !== null) {
          zoneDurations[zoneName] += duration / 60;
        }
      }

      movements.push({
        timestamp: event.timestamp,
        zoneName: event.Zone ? event.Zone.name : 'Zone not found',
        zoneType: event.Zone ? event.Zone.type : 'Zone not found',
        eventType: event.event_type,
        duration: event.duration,
      });

      if (index > 0) {
        const prevEvent = events[index - 1];
        const routeKey = `${prevEvent.zoneName}-${zoneName}`;

        if (eventType === 'enter' && prevEvent.eventType === 'exit') {
          const movementDuration = (new Date(timestamp) - new Date(prevEvent.timestamp)) / 60000;
          totalMovementTime += movementDuration;

          if (!movementTimes[routeKey]) {
            movementTimes[routeKey] = 0;
          }
          movementTimes[routeKey] += movementDuration;
        }

        if (!routeFrequencies[routeKey]) {
          routeFrequencies[routeKey] = 0;
        }
        routeFrequencies[routeKey] += 1;
      }

      if (eventType === 'exit' && index < events.length - 1 && events[index + 1].eventType === 'enter') {
        const nextEvent = events[index + 1];
        const relevantGnssPositions = gnssPositions.filter(gnss => gnss.timestamp >= event.timestamp && gnss.timestamp <= nextEvent.timestamp);

        relevantGnssPositions.forEach(gnss => {
          movements.push({
            timestamp: gnss.timestamp,
            latitude: gnss.latitude,
            longitude: gnss.longitude,
            eventType: 'gnss_position',
          });
        });
      }
    });

    const maxDuration = Math.max(...Object.values(zoneDurations));
    const maxFrequency = Math.max(...Object.values(routeFrequencies));

    const getColorByFrequency = (frequency) => {
      const ratio = frequency / maxFrequency;
      const r = Math.round(255 * ratio);
      const g = 0;
      const b = Math.round(255 * (1 - ratio));
      return `rgb(${r},${g},${b})`;
    };

    const getIntensityColor = (duration) => {
      const ratio = duration / maxDuration;
      const r = Math.round(255 * ratio);
      const g = 0;
      const b = Math.round(255 * (1 - ratio));
      return `rgba(${r},${g},${b},${ratio})`;
    };

    res.json({
      movements,
      zoneCoordinates,
      zoneDurations,
      routeFrequencies,
      movementTimes,
      totalMovementTime,
      getColorByFrequency,
      getIntensityColor
    });
  } catch (error) {
    logger.error('Ошибка при получении перемещений сотрудника:', { message: error.message, stack: error.stack });
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

// Подготовка данных для тепловой карты
exports.getHeatmapData = async (req, res) => {
  const { startDate, endDate } = req.query;
  const { id } = req.params;

  const start = startDate ? new Date(startDate) : new Date(new Date().setHours(0, 0, 0, 0));
  const end = endDate ? new Date(endDate) : new Date(new Date().setHours(23, 59, 59, 999));

  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ error: 'Сотрудник не найден' });
    }

    const events = await ZoneEvent.findAll({
      where: {
        employee_id: id,
        timestamp: {
          [Op.between]: [start, end],
        },
      },
      include: [Zone],
      order: [['timestamp', 'ASC']],
    });

    const movements = events.map(event => ({
      timestamp: event.timestamp,
      zoneName: event.Zone ? event.Zone.name : 'Zone not found',
      duration: event.duration,
    }));

    const heatmapData = movements.reduce((acc, curr) => {
      if (!acc[curr.zoneName]) {
        acc[curr.zoneName] = { totalDuration: 0, coordinates: curr.Zone ? curr.Zone.coordinates : [0, 0] };
      }
      acc[curr.zoneName].totalDuration += curr.duration || 0;
      return acc;
    }, {});

    res.json(heatmapData);
  } catch (error) {
    logger.error('Ошибка при получении данных для тепловой карты:', { message: error.message, stack: error.stack });
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

// Получение информации о сотруднике по ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Сотрудник не найден' });
    }
    res.json(employee);
  } catch (error) {
    logger.error('Ошибка при получении сотрудника:', { message: error.message, stack: error.stack });
    res.status(500).json({ error: 'Ошибка при получении сотрудника' });
  }
};

// Создание нового сотрудника
exports.createEmployee = async (req, res) => {
  try {
    const { first_name, last_name, middle_name, email, phone, department_id, position, beaconid } = req.body;

    // Логирование входящих данных
    logger.info('Получены данные для нового сотрудника:', req.body);

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
    logger.error('Ошибка при создании сотрудника:', { message: error.message, stack: error.stack });
    res.status(500).json({ error: 'Ошибка при создании сотрудника' });
  }
};

// Обновление информации о сотруднике
exports.updateEmployee = async (req, res) => {
  try {
    const { first_name, last_name, middle_name, email, phone, department_id, position, beaconid } = req.body;

    // Логирование входящих данных
    logger.info('Получены данные для обновления сотрудника:', req.body);

    // Если department_id пустой, установите его в null
    const deptId = department_id === '' ? null : department_id;

    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      logger.info('Сотрудник не найден:', req.params.id); // Логируем, если сотрудник не найден
      return res.status(404).json({ error: 'Сотрудник не найден' });
    }

    logger.info('Обновление сотрудника с id:', req.params.id); // Добавлено для отладки

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

    logger.info('Сотрудник обновлен успешно:', updatedEmployee); // Логирование обновленного сотрудника
    res.json(updatedEmployee);
  } catch (error) {
    logger.error('Ошибка при обновлении сотрудника:', { message: error.message, stack: error.stack });
    res.status(500).json({ error: 'Ошибка при обновлении сотрудника' });
  }
};

// Удаление сотрудника
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Сотрудник не найден' });
    }
    await employee.destroy();
    res.status(204).send();
  } catch (error) {
    logger.error('Ошибка при удалении сотрудника:', { message: error.message, stack: error.stack });
    res.status(500).json({ error: 'Ошибка при удалении сотрудника' });
  }
};

// Назначение метки сотруднику
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
    logger.error('Ошибка при назначении метки:', { message: error.message, stack: error.stack });
    res.status(500).json({ error: 'Ошибка при назначении метки' });
  }
};

// Получение местоположения сотрудника
exports.getEmployeeLocation = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id, {
      include: [
        { model: Department, attributes: ['name'], required: false } // Убедимся, что связь не обязательная
      ]
    });

    if (!employee) {
      logger.info('Сотрудник не найден:', req.params.id); // Отладка
      return res.status(404).json({ error: 'Сотрудник не найден' });
    }

    let locationData;
    const gnssPosition = await GNSSPosition.findOne({
      where: { device_id: employee.beaconid },
      order: [['timestamp', 'DESC']]
    });

    if (gnssPosition) {
      logger.info('GNSS позиция найдена:', gnssPosition); // Отладка
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

        logger.info('Позиция устройства в зоне найдена:', deviceZonePosition); // Отладка
        logger.info('Зона найдена:', zone); // Отладка
        logger.info('Метка найдена:', beacon); // Отладка

        locationData = {
          gps: false,
          coordinates: beacon && beacon.map_coordinates ? beacon.map_coordinates : [0, 0],
          zone: zone ? zone : 'Не указано',
          mapUrl: '/assets/brand/plan.jpg'
        };
      } else {
        logger.info('Позиция устройства в зоне не найдена'); // Отладка
      }
    }

    if (!locationData) {
      return res.status(404).json({ error: 'Данные о местоположении не найдены' });
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

    logger.info('Данные о местоположении:', result); // Отладка
    res.json(result);
  } catch (error) {
    logger.error('Ошибка при получении местоположения сотрудника:', { message: error.message, stack: error.stack });
    res.status(500).json({ error: 'Внутренняя ошибка сервера', details: error.message });
  }
};
