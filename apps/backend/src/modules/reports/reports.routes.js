import { Router } from "express";
import { generateWeeklyReportController } from "./reports.controller.js";

const router = Router();

router.post("/weekly", generateWeeklyReportController);

export default router;
