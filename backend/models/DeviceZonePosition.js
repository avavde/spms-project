// models/DeviceZonePosition.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DeviceZonePosition = sequelize.define('DeviceZonePosition', {
  deviceId: {
    type: DataTypes.STRING,
    references: {
      model: 'Devices',
      key: 'id'
    },
  },
  zoneId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Zones',
      key: 'id'
    },
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
  timestamps: true,
});

module.exports = DeviceZonePosition;
