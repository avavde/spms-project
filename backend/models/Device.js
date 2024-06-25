const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Device extends Model {}

Device.init({
  id: {
    type: DataTypes.STRING,
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
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'Device',
});

module.exports = Device;
