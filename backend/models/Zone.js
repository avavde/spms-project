const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

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
      model: 'Departments',
      key: 'id',
    },
    allowNull: true,
  },
  floor_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'FloorPlans',
      key: 'id',
    },
    allowNull: true,
    onDelete: 'SET NULL',
  },
  beacons: {
    type: DataTypes.ARRAY(DataTypes.INTEGER), // Обновленный тип данных для хранения массива идентификаторов маяков
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Zone',
  tableName: 'zones',
  timestamps: false,
});

module.exports = Zone;
