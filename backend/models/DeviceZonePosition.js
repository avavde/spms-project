const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class DeviceZonePosition extends Model {}

DeviceZonePosition.init({
  deviceId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  zoneid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  rssi: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  temperature: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  pressure: {
    type: DataTypes.FLOAT,
    allowNull: true,
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
  modelName: 'DeviceZonePosition',
  tableName: 'device_zone_positions',
  timestamps: false,
});

module.exports = DeviceZonePosition;
