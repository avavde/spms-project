const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Building = require('./Building');
const FloorPlan = require('./FloorPlan');

class BeaconFloorPlan extends Model {}

BeaconFloorPlan.init({
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
  },
  floorplan_id: {
    type: DataTypes.INTEGER,
    references: {
      model: FloorPlan,
      key: 'id',
    },
  },
  // другие поля
}, {
  sequelize,
  modelName: 'BeaconFloorPlan',
  tableName: 'beacon_floor_plans',
  timestamps: false,
});

BeaconFloorPlan.belongsTo(Building, { foreignKey: 'building_id' });

module.exports = BeaconFloorPlan;
