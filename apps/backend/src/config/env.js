import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 8080,
  frontendUrl: process.env.FRONTEND_URL,
  nodeEnv: process.env.NODE_ENV || "development",

  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "60m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  refreshCookieName: process.env.COOKIE_REFRESH_TOKEN_NAME || "refresh_token",
};
