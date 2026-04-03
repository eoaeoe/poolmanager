import { Router } from "express";
import {
  createUserController,
  deleteUserController,
  getUsers,
  updateUserController,
} from "./users.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";

const router = Router();

router.get("/", requireAuth, requireRole("boss"), getUsers);
router.post("/", requireAuth, requireRole("boss"), createUserController);
router.put("/:id", requireAuth, requireRole("boss"), updateUserController);
router.delete("/:id", requireAuth, requireRole("boss"), deleteUserController);

export default router;
