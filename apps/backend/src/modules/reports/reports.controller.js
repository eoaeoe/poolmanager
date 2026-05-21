import { env } from "../../config/env.js";
import { generateWeeklyReportPdf } from "./reports.service.js";

export async function generateWeeklyReportPdfController(req, res, next) {
  try {
    const secret = req.headers["x-report-secret"];

    if (secret !== env.reportSecret) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const pdfBuffer = await generateWeeklyReportPdf();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="informe-semanal-poolmanager.pdf"',
    );

    return res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
}
