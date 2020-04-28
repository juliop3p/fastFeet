module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('deliverymen', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('deliverymen', 'name');
  },
};
