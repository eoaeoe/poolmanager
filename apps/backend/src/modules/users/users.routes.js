import { Router } from "express";
import {
  createUserController,
  deleteUserController,
  getUsers,
  updateUserController,
  removeUserImageController,
} from "./users.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { uploadUserImage } from "../../middlewares/uploadUserImage.js";

const router = Router();

router.get("/", requireAuth, requireRole("boss"), getUsers);
router.post(
  "/",
  requireAuth,
  requireRole("boss"),
  uploadUserImage.single("image"),
  createUserController,
);
router.put(
  "/:id",
  requireAuth,
  requireRole("boss"),
  uploadUserImage.single("image"),
  updateUserController,
);
router.delete("/:id", requireAuth, requireRole("boss"), deleteUserController);

router.delete(
  "/:id/image",
  requireAuth,
  requireRole("boss"),
  removeUserImageController,
);

export default router;
