// Beacon.js

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Убедитесь, что путь к config/db правильный

class Beacon extends Model {}

Beacon.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  floor_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'FloorPlans', // имя модели должно совпадать с именем таблицы в базе данных
      key: 'id',
    },
    allowNull: true,
    onDelete: 'CASCADE',
  },
  zone_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Zones', // имя модели должно совпадать с именем таблицы в базе данных
      key: 'id',
    },
    allowNull: true,
    onDelete: 'CASCADE',
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
