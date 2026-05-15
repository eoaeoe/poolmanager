import { Pool, Work } from "../../../models/index.js";

export async function getLatestPoolLevels() {
  const works = await Work.findAll({
    where: {
      status: "finished",
    },
    include: [
      {
        model: Pool,
        as: "pool",
        attributes: ["id", "name"],
      },
    ],
    order: [["finishedAt", "DESC"]],
  });

  const latestByPool = new Map();

  for (const work of works) {
    if (!latestByPool.has(work.poolId)) {
      latestByPool.set(work.poolId, work);
    }
  }

  return Array.from(latestByPool.values()).map((work) => ({
    poolId: work.poolId,
    poolName: work.pool?.name ?? "Piscina sin nombre",
    finishedAt: work.finishedAt,
    ph: work.ph,
    freeChlorine: work.freeChlorine,
    totalChlorine: work.totalChlorine,
    alkalinity: work.alkalinity,
    waterAppearance: work.waterAppearance,
    waterLevel: work.waterLevel,
  }));
}
