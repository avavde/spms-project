// models/DeviceEvent.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DeviceEvent = sequelize.define('DeviceEvent', {
  deviceId: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  },
  event: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sync: {
    type: DataTypes.STRING,
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

module.exports = DeviceEvent;
