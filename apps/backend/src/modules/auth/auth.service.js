import bcrypt from "bcryptjs";

const users = [
  {
    id: "1",
    name: "Jefe Demo",
    email: "boss@poolmanager.com",
    role: "boss",
    passwordHash: bcrypt.hashSync("123456", 10),
  },
  {
    id: "2",
    name: "Empleado Demo",
    email: "employee@poolmanager.com",
    role: "employee",
    passwordHash: bcrypt.hashSync("123456", 10),
  },
];

const refreshTokensStore = new Map();

export async function findUserByEmail(email) {
  return users.find((user) => user.email === email) ?? null;
}

export async function validatePassword(plainPassword, passwordHash) {
  return bcrypt.compare(plainPassword, passwordHash);
}

export async function saveRefreshToken(userId, refreshToken) {
  refreshTokensStore.set(userId, refreshToken);
}

export async function getRefreshTokenByUserId(userId) {
  return refreshTokensStore.get(userId) ?? null;
}

export async function deleteRefreshTokenByUserId(userId) {
  refreshTokensStore.delete(userId);
}
