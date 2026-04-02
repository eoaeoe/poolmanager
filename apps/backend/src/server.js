import app from "./app.js";
import { env } from "./config/env.js";
import { sequelize } from "../models/index.js";

try {
  await sequelize.authenticate();
  console.log("Base de datos conectada correctamente");

  app.listen(env.port, () => {
    console.log(`Backend escuchando en http://localhost:${env.port}`);
  });
} catch (error) {
  console.error("Error al arrancar el servidor:", error);
  process.exit(1);
}
