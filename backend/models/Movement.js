// Movement.js

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
    onDelete: 'CASCADE',
  },
  to_zone_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Zone,
      key: 'id'
    },
    allowNull: false,
    onDelete: 'CASCADE',
  },
  from_gps_coordinates: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  to_gps_coordinates: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  from_beacon_coordinates: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  to_beacon_coordinates: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'Movement',
  tableName: 'movements',
  timestamps: false,
});

Movement.belongsTo(Device, { foreignKey: 'device_id' });
Movement.belongsTo(Zone, { foreignKey: 'from_zone_id', onDelete: 'CASCADE' });
Movement.belongsTo(Zone, { foreignKey: 'to_zone_id', onDelete: 'CASCADE' });

module.exports = Movement;
