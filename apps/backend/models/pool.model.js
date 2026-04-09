import { DataTypes } from "sequelize";

export function PoolModel(sequelize) {
  return sequelize.define(
    "Pool",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
      },
      zoneCode: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dimensionsText: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cubicMeters: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      waterOpen: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      waterOpenAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      manualPumpOn: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      manualPumpOnAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
    },
    {
      tableName: "pools",
    },
  );
}
