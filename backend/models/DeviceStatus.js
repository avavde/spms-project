// models/DeviceStatus.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DeviceStatus = sequelize.define('DeviceStatus', {
  deviceId: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  },
  battery: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sos: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  gps: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  beacons: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = DeviceStatus;
