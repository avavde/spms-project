// models/Device.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Device = sequelize.define('Device', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  fw_version: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nfc_uid: {
    type: DataTypes.STRING,
  },
  imei: {
    type: DataTypes.STRING,
  },
  mac_uwb: {
    type: DataTypes.STRING,
  },
  ip: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: true,
});

module.exports = Device;
