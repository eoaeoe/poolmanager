import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Op } from "sequelize";
import { Pool } from "../../../models/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolvePoolImagePath(imageUrl) {
  if (!imageUrl) return null;

  return path.join(
    __dirname,
    "../../..",
    imageUrl.replace("/uploads", "uploads"),
  );
}

export async function findPoolsPaginated({
  page,
  limit,
  search,
  sortField,
  sortOrder,
}) {
  const offset = (page - 1) * limit;
  const where = {};

  if (search) {
    where[Op.or] = [{ name: { [Op.iLike]: `%${search}%` } }];
  }

  const allowedSortFields = ["name", "zoneCode", "cubicMeters", "createdAt"];
  const safeSortField = allowedSortFields.includes(sortField)
    ? sortField
    : "createdAt";

  const safeSortOrder = sortOrder === "ASC" ? "ASC" : "DESC";

  const { rows, count } = await Pool.findAndCountAll({
    attributes: [
      "id",
      "name",
      "zoneCode",
      "dimensionsText",
      "cubicMeters",
      "waterOpen",
      "waterOpenAt",
      "manualPumpOn",
      "manualPumpOnAt",
      "imageUrl",
      "createdAt",
    ],
    where,
    offset,
    limit,
    order: [[safeSortField, safeSortOrder]],
  });

  return {
    pools: rows,
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };
}

export async function findPoolById(id) {
  return Pool.findByPk(id);
}

export async function findPoolByName(name) {
  return Pool.findOne({
    where: { name },
  });
}

export async function createPool(data) {
  const now = new Date();

  return Pool.create({
    name: data.name,
    zoneCode: data.zoneCode,
    dimensionsText: data.dimensionsText ?? null,
    cubicMeters: data.cubicMeters ?? null,
    waterOpen: data.waterOpen ?? false,
    waterOpenAt: data.waterOpen ? now : null,
    manualPumpOn: data.manualPumpOn ?? false,
    manualPumpOnAt: data.manualPumpOn ? now : null,
    imageUrl: data.imageUrl ?? null,
  });
}

export async function updatePool(id, data) {
  const pool = await Pool.findByPk(id);

  if (!pool) {
    return null;
  }

  if (data.name !== undefined) {
    pool.name = data.name;
  }

  if (data.zoneCode !== undefined) {
    pool.zoneCode = data.zoneCode;
  }

  if (data.dimensionsText !== undefined) {
    pool.dimensionsText = data.dimensionsText;
  }

  if (data.cubicMeters !== undefined) {
    pool.cubicMeters = data.cubicMeters;
  }

  if (data.imageUrl !== undefined) {
    pool.imageUrl = data.imageUrl;
  }

  if (data.waterOpen !== undefined) {
    const wasWaterOpen = pool.waterOpen;
    pool.waterOpen = data.waterOpen;

    if (!wasWaterOpen && data.waterOpen) {
      pool.waterOpenAt = new Date();
    } else if (wasWaterOpen && !data.waterOpen) {
      pool.waterOpenAt = null;
    }
  }

  if (data.manualPumpOn !== undefined) {
    const wasManualPumpOn = pool.manualPumpOn;
    pool.manualPumpOn = data.manualPumpOn;

    if (!wasManualPumpOn && data.manualPumpOn) {
      pool.manualPumpOnAt = new Date();
    } else if (wasManualPumpOn && !data.manualPumpOn) {
      pool.manualPumpOnAt = null;
    }
  }

  await pool.save();

  return pool;
}

export async function deletePool(id) {
  const pool = await Pool.findByPk(id);

  if (!pool) {
    return false;
  }

  if (pool.imageUrl) {
    const filePath = resolvePoolImagePath(pool.imageUrl);

    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  await pool.destroy();

  return true;
}

export async function removePoolImage(id) {
  const pool = await Pool.findByPk(id);

  if (!pool) {
    return null;
  }

  if (pool.imageUrl) {
    const filePath = resolvePoolImagePath(pool.imageUrl);

    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  pool.imageUrl = null;
  await pool.save();

  return pool;
}
