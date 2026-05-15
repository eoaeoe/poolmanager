import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import usersRoutes from "../modules/users/users.routes.js";
import poolsRoutes from "../modules/pools/pools.routes.js";
import worksRoutes from "../modules/works/works.routes.js";
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/pools", poolsRoutes);
router.use("/works", worksRoutes);
router.use("/dashboard", dashboardRoutes);

router.get("/health", (req, res) => {
  res.json({
    ok: true,
    message: "API funcionando",
  });
});

export default router;
