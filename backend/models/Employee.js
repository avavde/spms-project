const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Department = require('./Department');
const Device = require('./Device');

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
      model: Department,
      key: 'id',
    },
  },
  position: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  beaconid: {
    type: DataTypes.STRING, // Изменяем на STRING
    allowNull: true,
    references: {
      model: Device,
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'Employee',
  tableName: 'employees',
  timestamps: false,
});

Employee.belongsTo(Department, { foreignKey: 'department_id' });
Employee.belongsTo(Device, { foreignKey: 'beaconid', targetKey: 'id' });

module.exports = Employee;
