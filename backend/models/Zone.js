const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Zone = sequelize.define('Zone', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Departments',
      key: 'id'
    }
  }
});

module.exports = Zone;
