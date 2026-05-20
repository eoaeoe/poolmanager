import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import {
  getLatestPoolLevelsController,
  getDashboardSummaryController,
} from "./dashboard.controller.js";

const router = Router();

router.get(
  "/pool-levels",
  requireAuth,
  requireRole("boss"),
  getLatestPoolLevelsController,
);

router.get(
  "/summary",
  requireAuth,
  requireRole("boss"),
  getDashboardSummaryController,
);

export default router;
