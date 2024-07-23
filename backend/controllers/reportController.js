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

  // Добавление одного дня к endDate
  const endDatePlusOne = new Date(endDate);
  endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);

  const whereClause = {
    timestamp: {
      [Op.between]: [new Date(startDate), endDatePlusOne],
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
      acc[zone.id] = { type: zone.type, name: zone.name };
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
            [Op.between]: [new Date(startDate), endDatePlusOne]
          }
        }
      });
    }

    const employeeSummaries = {};

    zoneEvents.forEach(event => {
      if (!employeeSummaries[event.employee_id]) {
        employeeSummaries[event.employee_id] = {
          totalTimeInZones: 0,
          totalTimeMoving: 0, // Время на перемещения между зонами
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
          },
          lastEventTimestamp: null // Для расчета времени на перемещения
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
        const zoneType = zonesMap[event.zone_id] ? zonesMap[event.zone_id].type : 'regular';
        summary.zoneTime[zoneType] += event.duration;
      }

      if (summary.lastEventTimestamp) {
        const timeMoving = (new Date(event.timestamp) - new Date(summary.lastEventTimestamp)) / 1000 / 60; // Время на перемещение в минутах
        summary.totalTimeMoving += timeMoving;
      }
      summary.lastEventTimestamp = event.timestamp;
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
      summary.totalTimeMoving = summary.totalTimeMoving / 60; // Преобразование в минуты
      for (const zoneType in summary.zoneTime) {
        summary.zoneTime[zoneType] = summary.zoneTime[zoneType] / 60; // Преобразование в минуты
      }
    }

    const summaryData = [];
    const detailData = [];

    for (const employeeId in employeeSummaries) {
      const summary = employeeSummaries[employeeId];
      const employeeName = employeesMap[employeeId] || `Сотрудник ID ${employeeId}`;
      summaryData.push({
        'ФИО сотрудника': employeeName,
        'Общее время в зонах (минуты)': summary.totalTimeInZones,
        'Время на перемещения между зонами (минуты)': summary.totalTimeMoving, // Добавлено время на перемещения
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

        detailData.push({
          'ФИО сотрудника': employeeName,
          'ID зоны': event.zone_id,
          'Название зоны': zonesMap[event.zone_id] ? zonesMap[event.zone_id].name : 'Неизвестная зона',
          'Тип события': event.event_type,
          'Время': event.timestamp,
          'Продолжительность': event.duration,
          'Тип зоны': violation ? violation.zone_type : '',
          'Количество нарушений': violation ? 1 : 0,
          'Событие устройства': deviceEvent ? deviceEvent.event : null
        });
      });
    }

    const summaryFields = [
      'ФИО сотрудника', 
      'Общее время в зонах (минуты)', 
      'Время на перемещения между зонами (минуты)', // Добавлено поле
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
      'Время в обычных зонах (минуты)'
    ];
    
    const detailFields = [
      'ФИО сотрудника', 
      'ID зоны', 
      'Название зоны',
      'Тип события', 
      'Время', 
      'Продолжительность', 
      'Тип зоны', 
      'Количество нарушений', 
      'Событие устройства'
    ];

    const summaryCsv = parse(summaryData, { fields: summaryFields });
    const detailCsv = parse(detailData, { fields: detailFields });

    const summaryFilePath = path.join(__dirname, '../../frontend/public', 'reports', `employee_summary_${Date.now()}.csv`);
    const detailFilePath = path.join(__dirname, '../../frontend/public', 'reports', `employee_movements_${Date.now()}.csv`);
    
    const bom = Buffer.from('\ufeff', 'utf8');
    const summaryCsvWithBom = Buffer.concat([bom, Buffer.from(summaryCsv, 'utf8')]);
    const detailCsvWithBom = Buffer.concat([bom, Buffer.from(detailCsv, 'utf8')]);

    fs.writeFileSync(summaryFilePath, summaryCsvWithBom);
    fs.writeFileSync(detailFilePath, detailCsvWithBom);
 // Сохранение ссылок на отчеты в базе данных
    const summaryReportLink = `/reports/${path.basename(summaryFilePath)}`;
    const detailReportLink = `/reports/${path.basename(detailFilePath)}`;
    
    await Report.create({
      report_type: 'employee_resume',
      parameters: JSON.stringify(req.query),
      link: summaryReportLink
    });
    
    await Report.create({
      report_type: 'employee_zone_movements',
      parameters: JSON.stringify(req.query),
      link: detailReportLink
    });

    res.json({ 
      summaryLink: summaryReportLink, 
      detailLink: detailReportLink 
    });

  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Ошибка при формировании отчета', details: error.message });
  }
};

const generateEnterpriseSummary = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate || isNaN(new Date(startDate)) || isNaN(new Date(endDate))) {
    return res.status(400).json({ error: 'Некорректные значения дат' });
  }

  // Добавление одного дня к endDate
  const endDatePlusOne = new Date(endDate);
  endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);

  const whereClause = {
    timestamp: {
      [Op.between]: [new Date(startDate), endDatePlusOne],
    }
  };

  try {
    const zoneEvents = await ZoneEvent.findAll({ where: whereClause });
    const zoneViolations = await ZoneViolation.findAll({ where: whereClause });
    const zones = await Zone.findAll();
    const zonesMap = zones.reduce((acc, zone) => {
      acc[zone.id] = { type: zone.type, name: zone.name };
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
        const zoneType = zonesMap[event.zone_id] ? zonesMap[event.zone_id].type : 'regular';
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
    fs.writeFileSync(filePath, csv, 'utf8');

    // Сохранение ссылки на отчет в базе данных
    const reportLink = `/reports/${path.basename(filePath)}`;
    await Report.create({
      report_type: 'enterprise',
      parameters: JSON.stringify(req.query),
      link: reportLink
    });

    res.json({ link: reportLink });

  } catch (error) {
    console.error('Error generating enterprise summary:', error);
    res.status(500).json({ error: 'Ошибка при формировании сводного отчета' });
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
