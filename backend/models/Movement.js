const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Device = require('./Device');
const Zone = require('./Zone');

class Movement extends Model {}

Movement.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  device_id: {
    type: DataTypes.STRING,
    references: {
      model: Device,
      key: 'id'
    },
    allowNull: false,
  },
  from_zone_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Zone,
      key: 'id'
    },
    allowNull: false,
  },
  to_zone_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Zone,
      key: 'id'
    },
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Movement',
  tableName: 'movements',
  timestamps: false,
});

module.exports = Movement;
