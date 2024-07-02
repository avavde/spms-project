const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Путь к вашему файлу конфигурации базы данных

class Department extends Model {}

Department.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Department',
  tableName: 'departments',
  timestamps: false,
});

module.exports = Department;
