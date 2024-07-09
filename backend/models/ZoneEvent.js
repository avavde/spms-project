const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Employee = require('./Employee');
const Zone = require('./Zone');

class ZoneEvent extends Model {}

ZoneEvent.init({
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
  zone_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Zone,
      key: 'id'
    }
  },
  event_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'ZoneEvent',
  tableName: 'zone_events',
  timestamps: false,
});

module.exports = ZoneEvent;
