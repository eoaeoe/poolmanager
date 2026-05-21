import { env } from "../../config/env.js";
import { generateWeeklyReport } from "./reports.service.js";

export async function generateWeeklyReportController(req, res, next) {
  try {
    const secret = req.headers["x-report-secret"];

    if (secret !== env.reportSecret) {
      return res.status(401).json({
        message: "No autorizado",
      });
    }

    const report = await generateWeeklyReport();

    return res.status(200).json({
      report,
    });
  } catch (error) {
    next(error);
  }
}
