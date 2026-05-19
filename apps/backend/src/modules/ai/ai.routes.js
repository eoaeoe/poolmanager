import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { generatePoolDiagnosisController } from "./ai.controller.js";

const router = Router();

router.post(
  "/pool-diagnosis",
  requireAuth,
  requireRole("boss"),
  generatePoolDiagnosisController,
);

export default router;
