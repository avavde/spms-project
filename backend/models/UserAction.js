// UserAction.js

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

class UserAction extends Model {}

UserAction.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    allowNull: false,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'UserAction',
  tableName: 'user_actions',
  timestamps: false,
});

module.exports = UserAction;
