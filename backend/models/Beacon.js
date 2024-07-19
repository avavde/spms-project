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
      key: 'id',
    },
    allowNull: true,  // Сделал allowNull true для соответствия базе данных
    onDelete: 'CASCADE',
  },
  zone_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Zone,
      key: 'id',
    },
    allowNull: true,  // Добавлено allowNull true
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

Beacon.belongsTo(FloorPlan, { foreignKey: 'floor_id' });
Beacon.belongsTo(Zone, { foreignKey: 'zone_id' });

module.exports = Beacon;
