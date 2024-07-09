const Report = require('../models/Report');
const ZoneViolation = require('../models/ZoneViolation');
const Employee = require('../models/Employee');
const Department = require('../models/Department');

const generateReport = async (reportType, parameters) => {
  try {
    let reportData;

    switch (reportType) {
      case 'employee':
        reportData = await ZoneViolation.findAll({ where: { employee_id: parameters.employeeId } });
        break;
      case 'department':
        reportData = await ZoneViolation.findAll({ 
          include: [{
            model: Employee,
            where: { department_id: parameters.departmentId }
          }]
        });
        break;
      case 'enterprise':
        reportData = await ZoneViolation.findAll();
        break;
      default:
        throw new Error('Invalid report type');
    }

    const reportLink = `/reports/${reportType}-${Date.now()}.json`;
    require('fs').writeFileSync(`./public${reportLink}`, JSON.stringify(reportData));

    const report = await Report.create({
      report_type: reportType,
      parameters,
      link: reportLink
    });

    return report;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};

const getReports = async (req, res) => {
  try {
    const reports = await Report.findAll();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  generateReport,
  getReports,
};
