import express from "express";
import cookieParser from "cookie-parser";
import { corsMiddleware } from "./config/cors.js";
import indexRoutes from "./routes/index.routes.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import aiRoutes from "./modules/ai/ai.routes.js";
import reportsRoutes from "./modules/reports/reports.routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());

app.use("/api/reports", reportsRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api", indexRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);

export default app;
