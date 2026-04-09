import { Sequelize } from "sequelize";
import { env } from "../src/config/env.js";
import { UserModel } from "./user.model.js";
import { RefreshTokenModel } from "./refresh-token.model.js";
import { PoolModel } from "./pool.model.js";

export const sequelize = new Sequelize(env.dbName, env.dbUser, env.dbPassword, {
  host: env.dbHost,
  port: Number(env.dbPort),
  dialect: "postgres",
  logging: false,
});

export const User = UserModel(sequelize);
export const Pool = PoolModel(sequelize);
export const RefreshToken = RefreshTokenModel(sequelize);

User.hasMany(RefreshToken, {
  foreignKey: "userId",
  as: "refreshTokens",
});

RefreshToken.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});
