import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";

const router = Router();

router.use("/auth", authRoutes);

router.get("/health", (req, res) => {
  res.json({
    ok: true,
    message: "API funcionando",
  });
});

export default router;
