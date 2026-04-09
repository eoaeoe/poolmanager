import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import usersRoutes from "../modules/users/users.routes.js";
import poolsRoutes from "../modules/pools/pools.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/pools", poolsRoutes);

router.get("/health", (req, res) => {
  res.json({
    ok: true,
    message: "API funcionando",
  });
});

export default router;
