const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Movement = sequelize.define('Movement', {
  device_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Devices',
      key: 'id'
    }
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  altitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

module.exports = Movement;
