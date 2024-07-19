// Device.js

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Device extends Model {}

Device.init({
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  fw_version: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nfc_uid: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imei: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mac_uwb: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  devicetype: {
    type: DataTypes.STRING,
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
  modelName: 'Device',
  tableName: 'devices',
  timestamps: false,
});

module.exports = Device;
