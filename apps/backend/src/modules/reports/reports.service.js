import { Op } from "sequelize";
import { Pool, Work, User } from "../../../models/index.js";
import { openai } from "../../lib/openai.js";

export async function generateWeeklyReport() {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 7);

  const works = await Work.findAll({
    where: {
      status: "finished",
      finishedAt: {
        [Op.gte]: fromDate,
      },
    },
    include: [
      {
        model: Pool,
        as: "pool",
        attributes: ["id", "name"],
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "name"],
      },
    ],
    order: [["finishedAt", "DESC"]],
  });

  const totalWorks = works.length;

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

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content:
          "Eres un asistente experto en mantenimiento de piscinas. Redacta informes semanales claros, breves y profesionales.",
      },
      {
        role: "user",
        content: `
Genera un informe semanal profesional para PoolManager.

Datos generales:
- Periodo: últimos 7 días
- Total de mantenimientos: ${totalWorks}

Datos:
${JSON.stringify(reportData, null, 2)}

Devuelve el informe en texto plano, con secciones:
1. Resumen semanal
2. Piscinas con posibles incidencias
3. Observaciones relevantes
4. Recomendaciones
`,
      },
    ],
  });

  return (
    response.choices[0]?.message?.content ??
    "No se pudo generar el informe semanal."
  );
}
