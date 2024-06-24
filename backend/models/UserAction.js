const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserAction = sequelize.define('UserAction', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

module.exports = UserAction;
