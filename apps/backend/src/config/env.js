import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 8080,
  frontendUrl: process.env.FRONTEND_URL,
  nodeEnv: process.env.NODE_ENV || "development",

  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT || 5432,
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,

  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "60m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  refreshCookieName: process.env.COOKIE_REFRESH_TOKEN_NAME || "refresh_token",

  ollamaUrl: process.env.OLLAMA_URL ?? "http://localhost:11434",
  ollamaModel: process.env.OLLAMA_MODEL ?? "llama3.2",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
};
