import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { RefreshToken, User } from "../../../models/index.js";

export async function findUserByEmail(email) {
  return User.findOne({ where: { email } });
}

export async function validatePassword(plainPassword, passwordHash) {
  return bcrypt.compare(plainPassword, passwordHash);
}

export async function saveRefreshToken(userId, token, expiresAt) {
  return RefreshToken.create({
    userId,
    token,
    expiresAt,
  });
}

export async function getRefreshToken(token) {
  return RefreshToken.findOne({
    where: {
      token,
      expiresAt: {
        [Op.gt]: new Date(),
      },
    },
  });
}

export async function deleteRefreshToken(token) {
  return RefreshToken.destroy({
    where: { token },
  });
}

export async function deleteRefreshTokensByUserId(userId) {
  return RefreshToken.destroy({
    where: { userId },
  });
}
