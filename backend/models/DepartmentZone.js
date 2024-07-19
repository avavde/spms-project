// DepartmentZone.js

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Department = require('./Department');
const Zone = require('./Zone');

class DepartmentZone extends Model {}

DepartmentZone.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Department,
      key: 'id'
    }
  },
  zone_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Zone,
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'DepartmentZone',
  tableName: 'department_zones',
  timestamps: false,
});

DepartmentZone.belongsTo(Department, { foreignKey: 'department_id' });
DepartmentZone.belongsTo(Zone, { foreignKey: 'zone_id' });

module.exports = DepartmentZone;
