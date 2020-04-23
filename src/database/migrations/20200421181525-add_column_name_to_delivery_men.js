module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('delivery_mens', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('delivery_mens', 'name');
  },
};
