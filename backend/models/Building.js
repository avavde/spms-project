const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const FloorPlan = require('./FloorPlan');

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
    type: DataTypes.JSONB,
    allowNull: false,
  },
  dimensions: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'Building',
  tableName: 'buildings',
  timestamps: false,
});

Building.hasMany(FloorPlan, { foreignKey: 'building_id', as: 'floor_plans' });

module.exports = Building;
