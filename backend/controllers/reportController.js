const { Op } = require('sequelize');
const { Employee, ZoneEvent, ZoneViolation, DeviceEvent, Device, Zone, Report } = require('../models');
const fs = require('fs');
const path = require('path');
const { parse } = require('json2csv');

const generateReport = async (req, res) => {
  const { employeeId, startDate, endDate } = req.query;

  if (!startDate || !endDate || isNaN(new Date(startDate)) || isNaN(new Date(endDate))) {
    return res.status(400).json({ error: 'Некорректные значения дат' });
  }

  const whereClause = {
    timestamp: {
      [Op.between]: [new Date(startDate), new Date(endDate)],
    }
  };

  if (employeeId) {
    whereClause.employee_id = employeeId;
  }

  try {
    const zoneEvents = await ZoneEvent.findAll({ where: whereClause });
    const zoneViolations = await ZoneViolation.findAll({ where: whereClause });
    const zones = await Zone.findAll();
    const employees = await Employee.findAll();
    const zonesMap = zones.reduce((acc, zone) => {
      acc[zone.id] = zone.type;
      return acc;
    }, {});

    const employeesMap = employees.reduce((acc, employee) => {
      acc[employee.id] = `${employee.last_name} ${employee.first_name[0]}. ${employee.middle_name ? employee.middle_name[0] + '.' : ''}`;
      return acc;
    }, {});

    let deviceEvents = [];
    if (employeeId) {
      const devices = await Device.findAll({ where: { devicetype: 'badge' } });
      const deviceIds = devices.map(device => device.id);
      deviceEvents = await DeviceEvent.findAll({
        where: {
          device_id: { [Op.in]: deviceIds },
          timestamp: {
            [Op.between]: [new Date(startDate), new Date(endDate)]
          }
        }
      });
    }

    const employeeSummaries = {};

    zoneEvents.forEach(event => {
      if (!employeeSummaries[event.employee_id]) {
        employeeSummaries[event.employee_id] = {
          totalTimeInZones: 0,
          totalViolations: 0,
          totalEvents: 0,
          enterEvents: 0,
          exitEvents: 0,
          fallEvents: 0,
          inactivityEvents: 0,
          zoneTime: {
            forbidden: 0,
            working: 0,
            dangerous: 0,
            control: 0,
            regular: 0
          }
        };
      }

      const summary = employeeSummaries[event.employee_id];
      summary.totalEvents++;
      if (event.event_type === 'enter') summary.enterEvents++;
      if (event.event_type === 'exit') summary.exitEvents++;
      const violation = zoneViolations.find(v => v.employee_id === event.employee_id && v.timestamp === event.timestamp);
      if (violation) summary.totalViolations++;
      if (event.duration) {
        summary.totalTimeInZones += event.duration;
        const zoneType = zonesMap[event.zone_id] || 'regular';
        summary.zoneTime[zoneType] += event.duration;
      }
    });

    deviceEvents.forEach(event => {
      const employeeId = event.employee_id;
      if (employeeSummaries[employeeId]) {
        if (event.event === 'FALL') employeeSummaries[employeeId].fallEvents++;
        if (event.event === 'INACTIVITY') employeeSummaries[employeeId].inactivityEvents++;
      }
    });

    for (const key in employeeSummaries) {
      const summary = employeeSummaries[key];
      summary.totalTimeInZones = summary.totalTimeInZones / 60; // Преобразование в минуты
      for (const zoneType in summary.zoneTime) {
        summary.zoneTime[zoneType] = summary.zoneTime[zoneType] / 60; // Преобразование в минуты
      }
    }

    const reportData = [];
    for (const employeeId in employeeSummaries) {
      const summary = employeeSummaries[employeeId];
      const employeeName = employeesMap[employeeId] || `Сотрудник ID ${employeeId}`;
      reportData.push({
        'ФИО сотрудника': employeeName,
        'Общее время в зонах (минуты)': summary.totalTimeInZones,
        'Общее количество нарушений': summary.totalViolations,
        'Общее количество событий': summary.totalEvents,
        'Количество событий входа': summary.enterEvents,
        'Количество событий выхода': summary.exitEvents,
        'Количество падений': summary.fallEvents,
        'Количество неактивностей': summary.inactivityEvents,
        'Время в запрещенных зонах (минуты)': summary.zoneTime.forbidden,
        'Время в рабочих зонах (минуты)': summary.zoneTime.working,
        'Время в опасных зонах (минуты)': summary.zoneTime.dangerous,
        'Время в контрольных зонах (минуты)': summary.zoneTime.control,
        'Время в обычных зонах (минуты)': summary.zoneTime.regular
      });

      const employeeEvents = zoneEvents.filter(event => event.employee_id == employeeId);
      employeeEvents.forEach(event => {
        const violation = zoneViolations.find(v => v.employee_id === event.employee_id && v.timestamp === event.timestamp);
        const deviceEvent = deviceEvents.find(d => d.device_id === event.device_id && d.timestamp === event.timestamp);
  
        reportData.push({
          'ФИО сотрудника': employeeName,
          'ID зоны': event.zone_id,
          'Тип события': event.event_type,
          'Время': event.timestamp,
          'Продолжительность': event.duration,
          'Тип зоны': violation ? violation.zone_type : '',
          'Количество нарушений': violation ? 1 : 0,
          'Событие устройства': deviceEvent ? deviceEvent.event : null
        });
      });
    }

    // Добавление сводных данных
    const enterpriseSummary = {
      'Общее время в зонах (минуты)': totalTimeInZones,
      'Общее количество нарушений': totalViolations,
      'Общее количество событий': totalEvents,
      'Количество событий входа': enterEvents,
      'Количество событий выхода': exitEvents,
      'Время в запрещенных зонах (минуты)': zoneTime.forbidden,
      'Время в рабочих зонах (минуты)': zoneTime.working,
      'Время в опасных зонах (минуты)': zoneTime.dangerous,
      'Время в контрольных зонах (минуты)': zoneTime.control,
      'Время в обычных зонах (минуты)': zoneTime.regular
    };
    reportData.push({ ...enterpriseSummary, 'ФИО сотрудника': 'Сводные данные' });

    const fields = [
      'ФИО сотрудника', 
      'Общее время в зонах (минуты)', 
      'Общее количество нарушений', 
      'Общее количество событий', 
      'Количество событий входа', 
      'Количество событий выхода', 
      'Количество падений', 
      'Количество неактивностей', 
      'Время в запрещенных зонах (минуты)', 
      'Время в рабочих зонах (минуты)', 
      'Время в опасных зонах (минуты)', 
      'Время в контрольных зонах (минуты)', 
      'Время в обычных зонах (минуты)', 
      'ID зоны', 
      'Тип события', 
      'Время', 
      'Продолжительность', 
      'Тип зоны', 
      'Количество нарушений', 
      'Событие устройства'
    ];
    const csv = parse(reportData, { fields });

    const filePath = path.join(__dirname, '../../frontend/public', 'reports', `report_${Date.now()}.csv`);
    fs.writeFileSync(filePath, csv, 'utf8'); // Добавлена кодировка utf8

   // Сохранение ссылки на отчет в базе данных
    const reportLink = `/reports/${path.basename(filePath)}`;
    await Report.create({
      report_type: 'employee', // Тип отчета
      parameters: JSON.stringify(req.query), // Параметры запроса
      link: reportLink // Ссылка на отчет
    });

    res.json({ link: reportLink });

  } catch (error) {
    console.log(error.message);
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Ошибка при формировании отчета', details: error.message });
  }
};


const generateEnterpriseSummary = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate || isNaN(new Date(startDate)) || isNaN(new Date(endDate))) {
    return res.status(400).json({ error: 'Некорректные значения дат' });
  }

  const whereClause = {
    timestamp: {
      [Op.between]: [new Date(startDate), new Date(endDate)],
    }
  };

  try {
    const zoneEvents = await ZoneEvent.findAll({ where: whereClause });
    const zoneViolations = await ZoneViolation.findAll({ where: whereClause });
    const zones = await Zone.findAll();
    const zonesMap = zones.reduce((acc, zone) => {
      acc[zone.id] = zone.type;
      return acc;
    }, {});

    let totalTimeInZones = 0;
    let totalViolations = 0;
    let totalEvents = zoneEvents.length;
    let enterEvents = 0;
    let exitEvents = 0;
    let zoneTime = {
      forbidden: 0,
      working: 0,
      dangerous: 0,
      control: 0,
      regular: 0
    };

    zoneEvents.forEach(event => {
      if (event.event_type === 'enter') enterEvents++;
      if (event.event_type === 'exit') exitEvents++;
      const violation = zoneViolations.find(v => v.employee_id === event.employee_id && v.timestamp === event.timestamp);
      if (violation) totalViolations++;
      if (event.duration) {
        totalTimeInZones += event.duration;
        const zoneType = zonesMap[event.zone_id] || 'regular';
        zoneTime[zoneType] += event.duration;
      }
    });

    totalTimeInZones = totalTimeInZones / 60; // Преобразование в минуты
    for (const zoneType in zoneTime) {
      zoneTime[zoneType] = zoneTime[zoneType] / 60; // Преобразование в минуты
    }

    const enterpriseSummary = {
      'Общее время в зонах (минуты)': totalTimeInZones,
      'Общее количество нарушений': totalViolations,
      'Общее количество событий': totalEvents,
      'Количество событий входа': enterEvents,
      'Количество событий выхода': exitEvents,
      'Время в запрещенных зонах (минуты)': zoneTime.forbidden,
      'Время в рабочих зонах (минуты)': zoneTime.working,
      'Время в опасных зонах (минуты)': zoneTime.dangerous,
      'Время в контрольных зонах (минуты)': zoneTime.control,
      'Время в обычных зонах (минуты)': zoneTime.regular
    };

    const fields = [
      'Общее время в зонах (минуты)', 
      'Общее количество нарушений', 
      'Общее количество событий', 
      'Количество событий входа', 
      'Количество событий выхода', 
      'Время в запрещенных зонах (минуты)', 
      'Время в рабочих зонах (минуты)', 
      'Время в опасных зонах (минуты)', 
      'Время в контрольных зонах (минуты)', 
      'Время в обычных зонах (минуты)'
    ];
    const csv = parse([enterpriseSummary], { fields });

    const filePath = path.join(__dirname, '../../frontend/public', 'reports', `enterprise_summary_${Date.now()}.csv`);
    fs.writeFileSync(filePath, csv, 'utf8'); // Добавлена кодировка utf8

    // Сохранение ссылки на отчет в базе данных
    const reportLink = `/reports/${path.basename(filePath)}`;
    await Report.create({
      report_type: 'enterprise', // Тип отчета
      parameters: JSON.stringify(req.query), // Параметры запроса
      link: reportLink // Ссылка на отчет
    });

    res.json({ link: reportLink });

  } catch (error) {
    console.error('Error generating enterprise summary:', error);
    console.log(error.message);
    res.status(500).json({ error: 'Ошибка при формировании сводного отчета', details: error.message });
  }
};

const getReports = async (req, res) => {
  try {
    const reports = await Report.findAll();
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Ошибка при получении отчетов' });
  }
};

module.exports = { generateReport, generateEnterpriseSummary, getReports };

