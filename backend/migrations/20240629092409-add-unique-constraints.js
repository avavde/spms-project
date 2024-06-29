'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('device_events', {
      fields: ['device_id', 'timestamp'],
      type: 'unique',
      name: 'unique_device_event'
    });

    await queryInterface.addConstraint('device_self_tests', {
      fields: ['device_id'],
      type: 'unique',
      name: 'unique_device_self_test'
    });

    await queryInterface.addConstraint('gnss_positions', {
      fields: ['device_id', 'timestamp'],
      type: 'unique',
      name: 'unique_gnss_position'
    });

    await queryInterface.addConstraint('device_statuses', {
      fields: ['device_id', 'timestamp'],
      type: 'unique',
      name: 'unique_device_status'
    });

    await queryInterface.addConstraint('device_zone_positions', {
      fields: ['device_id', 'zone_id', 'timestamp'],
      type: 'unique',
      name: 'unique_device_zone_position'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('device_events', 'unique_device_event');
    await queryInterface.removeConstraint('device_self_tests', 'unique_device_self_test');
    await queryInterface.removeConstraint('gnss_positions', 'unique_gnss_position');
    await queryInterface.removeConstraint('device_statuses', 'unique_device_status');
    await queryInterface.removeConstraint('device_zone_positions', 'unique_device_zone_position');
  }
};
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
