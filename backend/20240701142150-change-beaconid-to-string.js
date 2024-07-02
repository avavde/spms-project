'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('employees', 'beaconid', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('employees', 'beaconid', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  }
};


