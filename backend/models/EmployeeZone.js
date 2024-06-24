const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Employee = require('./Employee');
const Zone = require('./Zone');

const EmployeeZone = sequelize.define('EmployeeZone', {
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Employee,
      key: 'id'
    }
  },
  zone_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Zone,
      key: 'id'
    }
  }
});

EmployeeZone.belongsTo(Employee, { foreignKey: 'employee_id' });
EmployeeZone.belongsTo(Zone, { foreignKey: 'zone_id' });

module.exports = EmployeeZone;
