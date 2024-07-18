const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Building = require('./Building');
const Beacon = require('./Beacon'); // Импорт модели Beacon

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
    allowNull: false,
    onDelete: 'CASCADE'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  map: {
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
  modelName: 'FloorPlan',
  tableName: 'floor_plans',
  timestamps: false,
});

FloorPlan.belongsTo(Building, { foreignKey: 'building_id', as: 'building' });
FloorPlan.hasMany(Beacon, { foreignKey: 'floor_id', as: 'beacons' });

module.exports = FloorPlan;
