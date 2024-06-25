// models/DeviceSelfTest.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DeviceSelfTest = sequelize.define('DeviceSelfTest', {
  deviceId: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  result: {
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

module.exports = DeviceSelfTest;
