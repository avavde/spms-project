const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class DeviceEvent extends Model {}

DeviceEvent.init({
  deviceId: {
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
});

module.exports = DeviceEvent;
