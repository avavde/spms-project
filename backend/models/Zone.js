const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Department = require('./Department');  // Статический импорт
const Beacon = require('./Beacon');          // Статический импорт

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
      key: 'id'
    },
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Zone',
  tableName: 'zones',
  timestamps: false,
});

// Устанавливаем связи после определения моделей
Zone.belongsTo(Department, { foreignKey: 'department_id' });
Zone.hasMany(Beacon, { foreignKey: 'zone_id', onDelete: 'CASCADE' });

module.exports = Zone;
