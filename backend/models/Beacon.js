const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Zone = require('./Zone');
const FloorPlan = require('./FloorPlan');

class Beacon extends Model {}

Beacon.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  zone_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Zone,
      key: 'id',
    },
    allowNull: true,
    onDelete: 'SET NULL',
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
  floor_id: {
    type: DataTypes.INTEGER,
    references: {
      model: FloorPlan,
      key: 'id',
    },
    allowNull: true,
    onDelete: 'SET NULL',
  },
}, {
  sequelize,
  modelName: 'Beacon',
  tableName: 'beacons',
  timestamps: false,
});

Beacon.belongsTo(Zone, { foreignKey: 'zone_id', as: 'zone' });
Beacon.belongsTo(FloorPlan, { foreignKey: 'floor_id', as: 'floor_plan' });

module.exports = Beacon;
