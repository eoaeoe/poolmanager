import { Pool, Work, User } from "../../../models/index.js";

export async function getCurrentWorkByUser(userId) {
  return await Work.findOne({
    where: {
      userId,
      status: "in_progress",
    },
    include: [
      {
        model: Pool,
        as: "pool",
        attributes: ["id", "name"],
      },
    ],
    order: [["startedAt", "DESC"]],
  });
}

export async function startWork({ userId, poolId }) {
  const pool = await Pool.findByPk(poolId);

  if (!pool) {
    return {
      error: true,
      status: 404,
      message: "Piscina no encontrada",
    };
  }

  const currentWork = await Work.findOne({
    where: {
      userId,
      status: "in_progress",
    },
  });

  if (currentWork) {
    return {
      error: true,
      status: 409,
      message: "Ya tienes un mantenimiento en curso",
    };
  }

  const work = await Work.create({
    userId,
    poolId,
    startedAt: new Date(),
    status: "in_progress",
  });

  const workWithPool = await Work.findByPk(work.id, {
    include: [
      {
        model: Pool,
        as: "pool",
        attributes: ["id", "name"],
      },
    ],
  });

  return {
    error: false,
    work: workWithPool,
  };
}

export async function finishWork({ workId, userId, data }) {
  const work = await Work.findByPk(workId);

  if (!work) {
    return {
      error: true,
      status: 404,
      message: "Trabajo no encontrado",
    };
  }

  if (work.userId !== userId) {
    return {
      error: true,
      status: 403,
      message: "No puedes finalizar un trabajo de otro usuario",
    };
  }

  if (work.status === "finished") {
    return {
      error: true,
      status: 409,
      message: "Este mantenimiento ya está finalizado",
    };
  }

  await work.update({
    finishedAt: new Date(),
    status: "finished",
    ph: Number(data.ph),
    freeChlorine: Number(data.freeChlorine),
    totalChlorine: Number(data.totalChlorine),
    alkalinity: Number(data.alkalinity),
    waterAppearance: data.waterAppearance,
    waterLevel: data.waterLevel,
    waterOpen: data.waterOpen,
    manualPumpOn: data.manualPumpOn,
    comment: data.comment?.trim() || null,
  });

  const pool = await Pool.findByPk(work.poolId);

  if (pool) {
    const nextWaterOpen = data.waterOpen === "1";
    const nextManualPumpOn = data.manualPumpOn === "1";

    const wasWaterOpen = pool.waterOpen;
    const wasManualPumpOn = pool.manualPumpOn;

    pool.waterOpen = nextWaterOpen;
    pool.manualPumpOn = nextManualPumpOn;

    if (!wasWaterOpen && nextWaterOpen) {
      pool.waterOpenAt = new Date();
    } else if (wasWaterOpen && !nextWaterOpen) {
      pool.waterOpenAt = null;
    }

    if (!wasManualPumpOn && nextManualPumpOn) {
      pool.manualPumpOnAt = new Date();
    } else if (wasManualPumpOn && !nextManualPumpOn) {
      pool.manualPumpOnAt = null;
    }

    await pool.save();
  }

  return {
    error: false,
    work,
  };
}

export async function getWorksByUser(userId) {
  return await Work.findAll({
    where: {
      userId,
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
}

export async function getWorksByPool(poolId) {
  return await Work.findAll({
    where: {
      poolId,
      status: "finished",
    },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email", "role"],
      },
    ],
    order: [["finishedAt", "DESC"]],
  });
}
