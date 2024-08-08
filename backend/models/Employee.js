// Employee.js

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Employee extends Model {}

Employee.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  middle_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Department',
      key: 'id',
    },
  },
  position: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  beaconid: {
    type: DataTypes.STRING,
    allowNull: true,
    references: {
      model: 'Devices',
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'Employee',
  tableName: 'employees',
  timestamps: false,
});

module.exports = Employee;
