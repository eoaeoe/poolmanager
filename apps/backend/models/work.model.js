import { DataTypes } from "sequelize";

export function WorkModel(sequelize) {
  return sequelize.define(
    "Work",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      poolId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      startedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      finishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("in_progress", "finished"),
        allowNull: false,
        defaultValue: "in_progress",
      },
      ph: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: true,
      },
      freeChlorine: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      totalChlorine: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      alkalinity: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: true,
      },
      waterAppearance: {
        type: DataTypes.ENUM(
          "cristalina",
          "turbia",
          "verde",
          "blanquecina",
          "amarillenta",
        ),
        allowNull: true,
      },
      waterLevel: {
        type: DataTypes.ENUM("bajo", "correcto", "alto"),
        allowNull: true,
      },
      waterOpen: {
        type: DataTypes.CHAR(1),
        allowNull: true,
      },
      manualPumpOn: {
        type: DataTypes.CHAR(1),
        allowNull: true,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "works",
    },
  );
}
