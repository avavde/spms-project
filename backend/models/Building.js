const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const FloorPlan = require('./FloorPlan'); // Импортируем модель FloorPlan

class Building extends Model {}

Building.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gps_coordinates: {
    type: DataTypes.JSON,
    allowNull: true, // GPS координаты здания
  },
  dimensions: {
    type: DataTypes.JSON,
    allowNull: true, // Размеры здания (например, ширина и длина)
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
  modelName: 'Building',
  tableName: 'buildings',
  timestamps: false,
});

Building.hasMany(FloorPlan, { foreignKey: 'building_id' }); // Устанавливаем связь с FloorPlan

module.exports = Building;
