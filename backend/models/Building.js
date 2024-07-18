const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const FloorPlan = require('./FloorPlan'); // Импорт модели FloorPlan

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
    allowNull: true,
  },
  dimensions: {
    type: DataTypes.JSON,
    allowNull: true,
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

Building.hasMany(FloorPlan, { foreignKey: 'building_id', as: 'floorPlans' });

module.exports = Building;
