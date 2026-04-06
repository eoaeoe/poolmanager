import express from "express";
import cookieParser from "cookie-parser";
import { corsMiddleware } from "./config/cors.js";
import indexRoutes from "./routes/index.routes.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api", indexRoutes);

export default app;
