const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class DeviceSelfTest extends Model {}

DeviceSelfTest.init({
  device_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  result: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdat: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedat: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'DeviceSelfTest',
  tableName: 'device_self_tests',
  timestamps: false,
});

module.exports = DeviceSelfTest;
