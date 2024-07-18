// models/Beacon.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Zone = require('./Zone');
const Floor = require('./FloorPlan'); // Импортируем модель Floor

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
      model: Zone,
      key: 'id',
      onDelete: 'CASCADE', // Каскадное удаление
    }
  },
  floor_id: { // Добавляем связь с Floor
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Floor,
      key: 'id',
      onDelete: 'CASCADE', // Каскадное удаление
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

Beacon.belongsTo(Zone, { foreignKey: 'zone_id' });
Beacon.belongsTo(Floor, { foreignKey: 'floor_id' }); // Устанавливаем связь с Floor

module.exports = Beacon;
