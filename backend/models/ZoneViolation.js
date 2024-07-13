const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Employee = require('./Employee');
const Zone = require('./Zone');

class ZoneViolation extends Model {}

ZoneViolation.init({
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
      key: 'id'
    }
  },
  zone_type: {
    type: DataTypes.STRING,
    allowNull: true, // Разрешить NULL
  },
  zones: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true,
  },
  time_spent: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  violation_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  last_updated: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
}, {
  sequelize,
  modelName: 'ZoneViolation',
  tableName: 'zone_violations',
  timestamps: false,
});

module.exports = ZoneViolation;
