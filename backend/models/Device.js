const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Device = sequelize.define('Device', {
  fw_version: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nfc_uid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imei: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  mac_uwb: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Device;
