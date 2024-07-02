const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class DeviceZonePosition extends Model {}

DeviceZonePosition.init({
  device_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  zone_id: {
    type: DataTypes.INTEGER,
    allowNull: true,  // Разрешить NULL
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    primaryKey: true
  },
  rssi: {
    type: DataTypes.FLOAT,
    allowNull: true,
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
    defaultValue: DataTypes.NOW
  },
  updatedat: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'DeviceZonePosition',
  timestamps: false,
  tableName: 'device_zone_positions'
});

module.exports = DeviceZonePosition;
