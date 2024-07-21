const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
   logging: console.log, // Enable logging to see the actual SQL queries
  },
);

module.exports = sequelize;
