const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Department = require('./Department');
const Zone = require('./Zone');

const DepartmentZone = sequelize.define('DepartmentZone', {
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
});

DepartmentZone.belongsTo(Department, { foreignKey: 'department_id' });
DepartmentZone.belongsTo(Zone, { foreignKey: 'zone_id' });

module.exports = DepartmentZone;
