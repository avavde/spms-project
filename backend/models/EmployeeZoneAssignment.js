// EmployeeZoneAssignment.js

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Employee = require('./Employee');
const Zone = require('./Zone');

class EmployeeZoneAssignment extends Model {}

EmployeeZoneAssignment.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Employee,
      key: 'id',
    },
  },
  zone_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Zone,
      key: 'id',
    },
  },
  assignment_type: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'EmployeeZoneAssignment',
  tableName: 'employee_zone_assignments',
  timestamps: false,
});

EmployeeZoneAssignment.belongsTo(Employee, { foreignKey: 'employee_id' });
EmployeeZoneAssignment.belongsTo(Zone, { foreignKey: 'zone_id' });

module.exports = EmployeeZoneAssignment;
