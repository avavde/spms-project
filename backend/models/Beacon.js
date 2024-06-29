const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Zone = require('./Zone');

class Beacon extends Model {}

Beacon.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  zone_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Zone,
      key: 'id'
    }
  },
  beacon_mac: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Beacon',
  tableName: 'beacons',
  timestamps: false,
});

module.exports = Beacon;
