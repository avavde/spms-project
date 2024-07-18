const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const FloorPlan = require('./FloorPlan');
const Zone = require('./Zone');

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
      key: 'id'
    },
    allowNull: false
  },
  zone_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Zone,
      key: 'id'
    },
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Beacon',
  tableName: 'beacons',
  timestamps: false,
});

Beacon.belongsTo(FloorPlan, { foreignKey: 'floor_id', as: 'floorPlan' });
Beacon.belongsTo(Zone, { foreignKey: 'zone_id', as: 'zone' });

module.exports = Beacon;
