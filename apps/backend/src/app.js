import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import indexRoutes from "./routes/index.routes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api", indexRoutes);

export default app;
