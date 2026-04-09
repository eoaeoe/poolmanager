"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pools", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },
      zoneCode: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      dimensionsText: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      cubicMeters: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      waterOpen: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      waterOpenAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      manualPumpOn: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      manualPumpOnAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      imageUrl: {
        type: Sequelize.STRING(300),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("pools");
  },
};
