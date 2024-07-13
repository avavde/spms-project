const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Zone = require('./Zone');

class Beacon extends Model {}

Beacon.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  zone_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'zones',
      key: 'id',
      onDelete: 'CASCADE'  // Каскадное удаление
    }
  },
  beacon_mac: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  map_coordinates: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  gps_coordinates: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Beacon',
  tableName: 'beacons',
  timestamps: false,
});

module.exports = Beacon;
