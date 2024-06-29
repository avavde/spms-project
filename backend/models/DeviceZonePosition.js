const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class DeviceZonePosition extends Model {}

DeviceZonePosition.init({
  device_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  zone_id: {
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
