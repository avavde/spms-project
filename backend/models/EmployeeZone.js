// EmployeeZone.js

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Employee = require('./Employee');
const Zone = require('./Zone');

class EmployeeZone extends Model {}

EmployeeZone.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  employee_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Employee,
      key: 'id'
    },
    allowNull: false,
  },
  zone_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Zone,
      key: 'id'
    },
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'EmployeeZone',
  tableName: 'employee_zones',
  timestamps: false,
});

EmployeeZone.belongsTo(Employee, { foreignKey: 'employee_id' });
EmployeeZone.belongsTo(Zone, { foreignKey: 'zone_id' });

module.exports = EmployeeZone;
