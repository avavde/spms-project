'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('zones', 'department_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'departments', // Имя таблицы, на которую ссылаемся
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('zones', 'department_id');
  }
};

