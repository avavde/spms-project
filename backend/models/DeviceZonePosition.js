const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DeviceZonePosition = sequelize.define('DeviceZonePosition', {
  deviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  zoneId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  rssi: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  temperature: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  pressure: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  indexes: [
    {
      unique: true,
      fields: ['deviceId', 'zoneId']
    }
  ]
});

module.exports = DeviceZonePosition;
