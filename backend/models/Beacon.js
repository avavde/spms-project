const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const FloorPlan = require('./FloorPlan');

class Beacon extends Model {}

Beacon.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  floor_id: {
    type: DataTypes.INTEGER,
    references: {
      model: FloorPlan,
      key: 'id',
    },
    allowNull: false,
    onDelete: 'CASCADE',
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

Beacon.belongsTo(FloorPlan, { foreignKey: 'floor_id', as: 'floor' });

module.exports = Beacon;
