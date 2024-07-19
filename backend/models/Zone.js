const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Department = require('./Department');
const FloorPlan = require('./FloorPlan');
const Beacon = require('./Beacon');

class Zone extends Model {}

Zone.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  coordinates: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  department_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'departments',
      key: 'id',
    },
    allowNull: true,
  },
  floor_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'floor_plans',
      key: 'id',
    },
    allowNull: true,
    onDelete: 'SET NULL',
  },
}, {
  sequelize,
  modelName: 'Zone',
  tableName: 'zones',
  timestamps: false,
});

Zone.belongsTo(Department, { foreignKey: 'department_id' });
Zone.belongsTo(FloorPlan, { foreignKey: 'floor_id' });
Zone.hasMany(Beacon, { foreignKey: 'zone_id', onDelete: 'CASCADE' });

module.exports = Zone;
