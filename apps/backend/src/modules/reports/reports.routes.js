import { Router } from "express";
import { generateWeeklyReportPdfController } from "./reports.controller.js";

const router = Router();

router.post("/weekly/pdf", generateWeeklyReportPdfController);

export default router;
