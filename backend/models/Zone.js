const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Department = require('./Department');

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
    allowNull: true, // Поле может быть NULL
  },
}, {
  sequelize,
  modelName: 'Zone',
  tableName: 'zones',
  timestamps: false,
});

Zone.belongsTo(Department, { foreignKey: 'department_id' });

module.exports = Zone;
