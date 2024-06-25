const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const GNSSPosition = sequelize.define('GNSSPosition', {
  deviceId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.BIGINT,
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
  satQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  hdop: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  vdop: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = GNSSPosition;
