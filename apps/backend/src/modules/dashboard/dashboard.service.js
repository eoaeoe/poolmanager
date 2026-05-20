import { Op, fn, col, literal } from "sequelize";
import { Pool, Work, User } from "../../../models/index.js";

function getDateDaysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function getPoolStatusFromLastWork(lastWork) {
  if (!lastWork) return "warning";

  const ph = Number(lastWork.ph);
  const freeChlorine = Number(lastWork.freeChlorine);
  const alkalinity = Number(lastWork.alkalinity);

  if (
    lastWork.waterAppearance === "verde" ||
    ph >= 8.4 ||
    ph < 7 ||
    freeChlorine < 0.5
  ) {
    return "critical";
  }

  if (
    lastWork.waterAppearance === "turbia" ||
    ph > 7.8 ||
    freeChlorine < 1 ||
    alkalinity < 80 ||
    alkalinity > 160
  ) {
    return "warning";
  }

  return "ok";
}

export async function getDashboardSummary() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sevenDaysAgo = getDateDaysAgo(7);

  const [
    totalPools,
    worksToday,
    waterOpenPools,
    manualPumpOnPools,
    recentWorks,
    avgDurationResult,
  ] = await Promise.all([
    Pool.count(),

    Work.count({
      where: {
        status: "finished",
        finishedAt: {
          [Op.gte]: today,
        },
      },
    }),

    Pool.count({
      where: {
        waterOpen: true,
      },
    }),

    Pool.count({
      where: {
        manualPumpOn: true,
      },
    }),

    Work.findAll({
      where: {
        status: "finished",
      },
      include: [
        {
          model: Pool,
          as: "pool",
          attributes: ["id", "name", "waterOpen", "manualPumpOn"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name"],
        },
      ],
      order: [["finishedAt", "DESC"]],
      limit: 20,
    }),

    Work.findOne({
      attributes: [
        [
          literal(
            `ROUND(AVG(EXTRACT(EPOCH FROM ("finishedAt" - "startedAt")) / 60))`,
          ),
          "avgDurationMinutes",
        ],
      ],
      where: {
        status: "finished",
        finishedAt: {
          [Op.gte]: sevenDaysAgo,
        },
      },
      raw: true,
    }),
  ]);

  const latestByPool = new Map();

  for (const work of recentWorks) {
    if (!latestByPool.has(work.poolId)) {
      latestByPool.set(work.poolId, work);
    }
  }

  let okPools = 0;
  let warningPools = 0;
  let criticalPools = 0;

  for (const work of latestByPool.values()) {
    const status = getPoolStatusFromLastWork(work);

    if (status === "ok") okPools += 1;
    if (status === "warning") warningPools += 1;
    if (status === "critical") criticalPools += 1;
  }

  const activeAlerts = recentWorks
    .map((work) => {
      const status = getPoolStatusFromLastWork(work);

      if (status === "ok") return null;

      return {
        workId: work.id,
        poolId: work.poolId,
        poolName: work.pool?.name ?? "Piscina sin nombre",
        status,
        finishedAt: work.finishedAt,
        ph: work.ph,
        freeChlorine: work.freeChlorine,
        alkalinity: work.alkalinity,
        waterAppearance: work.waterAppearance,
        waterLevel: work.waterLevel,
      };
    })
    .filter(Boolean)
    .slice(0, 5);

  const worksByDay = await Work.findAll({
    attributes: [
      [fn("DATE", col("finishedAt")), "date"],
      [fn("COUNT", col("id")), "total"],
    ],
    where: {
      status: "finished",
      finishedAt: {
        [Op.gte]: sevenDaysAgo,
      },
    },
    group: [fn("DATE", col("finishedAt"))],
    order: [[fn("DATE", col("finishedAt")), "ASC"]],
    raw: true,
  });

  return {
    kpis: {
      totalPools,
      worksToday,
      waterOpenPools,
      manualPumpOnPools,
      avgDurationMinutes: Number(avgDurationResult?.avgDurationMinutes ?? 0),
      criticalPools,
      warningPools,
      okPools,
    },
    poolStatus: {
      ok: okPools,
      warning: warningPools,
      critical: criticalPools,
    },
    activeAlerts,
    worksByDay,
    recentActivity: recentWorks.slice(0, 5),
  };
}

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
