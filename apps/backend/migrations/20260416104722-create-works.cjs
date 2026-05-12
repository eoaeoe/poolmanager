"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("works", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      poolId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "pools",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      startedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      finishedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("in_progress", "finished"),
        allowNull: false,
        defaultValue: "in_progress",
      },
      ph: {
        type: Sequelize.DECIMAL(4, 2),
        allowNull: true,
      },
      freeChlorine: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      totalChlorine: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      alkalinity: {
        type: Sequelize.DECIMAL(6, 2),
        allowNull: true,
      },
      waterAppearance: {
        type: Sequelize.ENUM(
          "cristalina",
          "turbia",
          "verde",
          "blanquecina",
          "amarillenta",
        ),
        allowNull: true,
      },
      waterLevel: {
        type: Sequelize.ENUM("bajo", "correcto", "alto"),
        allowNull: true,
      },
      waterOpen: {
        type: Sequelize.CHAR(1),
        allowNull: true,
      },
      manualPumpOn: {
        type: Sequelize.CHAR(1),
        allowNull: true,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("works", ["userId"]);
    await queryInterface.addIndex("works", ["poolId"]);
    await queryInterface.addIndex("works", ["status"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("works");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_works_status";',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_works_waterAppearance";',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_works_waterLevel";',
    );
  },
};
