const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Department = require('./Department');
const Beacon = require('./Beacon');
const FloorPlan = require('./FloorPlan');

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
  beacons: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
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

Zone.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });
Zone.belongsTo(FloorPlan, { foreignKey: 'floor_id', as: 'floor_plan' });
Zone.hasMany(Beacon, { foreignKey: 'zone_id', onDelete: 'CASCADE', as: 'beacons' });

module.exports = Zone;
