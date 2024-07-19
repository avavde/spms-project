const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const FloorPlan = require('./FloorPlan'); // Убедитесь, что путь к FloorPlan правильный и модель загружается корректно

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
    allowNull: true,
  },
  dimensions: {
    type: DataTypes.JSONB,
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

// Проверка на корректность модели FloorPlan
if (FloorPlan.prototype instanceof Model) {
  Building.hasMany(FloorPlan, { foreignKey: 'building_id', onDelete: 'CASCADE' });
} else {
  console.error('FloorPlan is not a subclass of Sequelize.Model');
}

module.exports = Building;
