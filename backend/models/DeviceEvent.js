// models/DeviceEvent.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class DeviceEvent extends Model {}

DeviceEvent.init({
  device_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  event: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sync: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  createdat: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedat: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'DeviceEvent',
  tableName: 'device_events',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['device_id', 'timestamp']
    }
  ]
});

module.exports = DeviceEvent;

