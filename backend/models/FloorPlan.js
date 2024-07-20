// models/FloorPlan.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Building = require('./Building');

class FloorPlan extends Model {}

FloorPlan.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  building_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Building,
      key: 'id',
    },
    allowNull: true,
    onDelete: 'SET NULL',
  },
  name: {
    type: DataTypes.STRING,
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
  file_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  file_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'FloorPlan',
  tableName: 'floor_plans',
  timestamps: false,
});

FloorPlan.belongsTo(Building, { foreignKey: 'building_id' });

module.exports = FloorPlan;
