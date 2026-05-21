import PDFDocument from "pdfkit";
import { Op } from "sequelize";
import { Pool, Work, User } from "../../../models/index.js";
import { openai } from "../../lib/openai.js";

export async function generateWeeklyReportPdf() {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 7);

  const works = await Work.findAll({
    where: {
      status: "finished",
      finishedAt: { [Op.gte]: fromDate },
    },
    include: [
      { model: Pool, as: "pool", attributes: ["id", "name"] },
      { model: User, as: "user", attributes: ["id", "name"] },
    ],
    order: [["finishedAt", "DESC"]],
  });

  const reportData = works.map((work) => ({
    piscina: work.pool?.name,
    empleado: work.user?.name,
    fecha: work.finishedAt,
    ph: work.ph,
    cloroLibre: work.freeChlorine,
    cloroTotal: work.totalChlorine,
    alcalinidad: work.alkalinity,
    apariencia: work.waterAppearance,
    nivelAgua: work.waterLevel,
    comentario: work.comment,
  }));

  let aiSummary = "No se pudo generar el resumen IA.";

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "Eres un experto en mantenimiento de piscinas. Redacta informes semanales claros y profesionales.",
        },
        {
          role: "user",
          content: `
Genera un informe semanal breve para PoolManager.

Total de mantenimientos: ${works.length}

Datos:
${JSON.stringify(reportData, null, 2)}

Incluye:
1. Resumen semanal
2. Incidencias relevantes
3. Recomendaciones
`,
        },
      ],
    });

    aiSummary = response.choices[0]?.message?.content ?? aiSummary;
  } catch {
    aiSummary = `Durante los últimos 7 días se han registrado ${works.length} mantenimientos.`;
  }

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(20).text("Informe semanal PoolManager", {
      align: "center",
    });

    doc.moveDown();
    doc
      .fontSize(11)
      .text(`Fecha de generación: ${new Date().toLocaleString()}`);
    doc.text(`Periodo: últimos 7 días`);
    doc.text(`Total de mantenimientos: ${works.length}`);

    doc.moveDown();
    doc.fontSize(15).text("Resumen IA");
    doc.moveDown(0.5);
    doc.fontSize(11).text(aiSummary, {
      align: "justify",
    });

    doc.moveDown();
    doc.fontSize(15).text("Mantenimientos registrados");
    doc.moveDown(0.5);

    works.forEach((work) => {
      doc
        .fontSize(11)
        .text(`Piscina: ${work.pool?.name ?? "-"}`)
        .text(`Empleado: ${work.user?.name ?? "-"}`)
        .text(`Fecha: ${new Date(work.finishedAt).toLocaleString()}`)
        .text(
          `pH: ${work.ph ?? "-"} | Cloro libre: ${work.freeChlorine ?? "-"} | Alcalinidad: ${work.alkalinity ?? "-"}`,
        )
        .text(
          `Apariencia: ${work.waterAppearance ?? "-"} | Nivel: ${work.waterLevel ?? "-"}`,
        )
        .moveDown();
    });

    doc.end();
  });
}
