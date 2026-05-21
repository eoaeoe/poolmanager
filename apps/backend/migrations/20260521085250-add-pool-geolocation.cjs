"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("pools", "latitude", {
      type: Sequelize.DECIMAL(10, 7),
      allowNull: true,
    });

    await queryInterface.addColumn("pools", "longitude", {
      type: Sequelize.DECIMAL(10, 7),
      allowNull: true,
    });

    await queryInterface.addIndex("pools", ["latitude"]);
    await queryInterface.addIndex("pools", ["longitude"]);
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("pools", ["latitude"]);
    await queryInterface.removeIndex("pools", ["longitude"]);

    await queryInterface.removeColumn("pools", "latitude");
    await queryInterface.removeColumn("pools", "longitude");
  },
};
