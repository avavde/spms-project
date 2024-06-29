const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class DeviceStatus extends Model {}

DeviceStatus.init({
  device_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  battery: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sos: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  gps: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  beacons: {
    type: DataTypes.INTEGER,
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
  modelName: 'DeviceStatus',
  tableName: 'device_statuses',
  timestamps: false,
});

module.exports = DeviceStatus;
