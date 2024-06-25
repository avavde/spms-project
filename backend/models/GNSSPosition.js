const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const GNSSPosition = sequelize.define('GNSSPosition', {
  deviceId: {
    type: DataTypes.STRING,
    references: {
      model: 'Devices',
      key: 'id'
    },
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
    allowNull: false,
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
}, {
  timestamps: true,
});

module.exports = GNSSPosition;
