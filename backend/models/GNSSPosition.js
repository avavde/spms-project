// GNSSPosition.js

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class GNSSPosition extends Model {}

GNSSPosition.init({
  device_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  height: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  sat_quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  hdop: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  vdop: {
    type: DataTypes.FLOAT,
    allowNull: true,
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
  modelName: 'GNSSPosition',
  tableName: 'gnss_positions',
  timestamps: false,
});

module.exports = GNSSPosition;
