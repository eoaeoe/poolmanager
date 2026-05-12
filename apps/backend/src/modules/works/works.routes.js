import { Router } from "express";
import {
  finishWorkController,
  getCurrentWorkController,
  startWorkController,
  getWorksByUserController,
  getWorksByPoolController,
} from "./works.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";

const router = Router();

router.get(
  "/current",
  requireAuth,
  requireRole("boss", "employee"),
  getCurrentWorkController,
);

router.post(
  "/start",
  requireAuth,
  requireRole("boss", "employee"),
  startWorkController,
);

router.post(
  "/:id/finish",
  requireAuth,
  requireRole("boss", "employee"),
  finishWorkController,
);

router.get(
  "/by-user/:userId",
  requireAuth,
  requireRole("boss", "employee"),
  getWorksByUserController,
);

router.get(
  "/by-pool/:poolId",
  requireAuth,
  requireRole("boss", "employee"),
  getWorksByPoolController,
);

export default router;
