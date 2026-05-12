import { Router } from "express";
import {
  createPoolController,
  deletePoolController,
  getPools,
  removePoolImageController,
  updatePoolController,
  getAllPoolsController,
} from "./pools.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { uploadPoolImage } from "../../middlewares/uploadPoolImage.js";

const router = Router();

router.get(
  "/all",
  requireAuth,
  requireRole("boss", "employee"),
  getAllPoolsController,
);

router.get("/", requireAuth, requireRole("boss"), getPools);

router.post(
  "/",
  requireAuth,
  requireRole("boss"),
  uploadPoolImage.single("image"),
  createPoolController,
);

router.put(
  "/:id",
  requireAuth,
  requireRole("boss"),
  uploadPoolImage.single("image"),
  updatePoolController,
);

router.delete("/:id", requireAuth, requireRole("boss"), deletePoolController);

router.delete(
  "/:id/image",
  requireAuth,
  requireRole("boss"),
  removePoolImageController,
);

export default router;
