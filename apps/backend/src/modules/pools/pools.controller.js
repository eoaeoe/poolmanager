import { isValidZoneCode } from "../../constants/zones.js";
import {
  createPool,
  deletePool,
  findPoolById,
  findPoolByName,
  findPoolsPaginated,
  removePoolImage,
  updatePool,
} from "./pools.service.js";

function parseBoolean(value) {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return undefined;
}

async function validatePoolUpdate(id, name, existingPool) {
  if (!existingPool) {
    return { error: true, status: 404, message: "Piscina no encontrada" };
  }

  const normalizedName = name?.trim().toLowerCase();
  const existingName = existingPool.name.trim().toLowerCase();

  if (normalizedName && normalizedName !== existingName) {
    const duplicate = await findPoolByName(name);

    if (duplicate && duplicate.id !== id) {
      return {
        error: true,
        status: 409,
        message: "Ya existe una piscina con ese nombre",
      };
    }
  }

  return { error: false };
}

function validateZoneCode(zoneCode) {
  if (zoneCode === undefined) {
    return { error: false };
  }

  const parsedZoneCode = Number(zoneCode);

  if (!isValidZoneCode(parsedZoneCode)) {
    return { error: true, status: 400, message: "Zona inválida" };
  }

  return { error: false };
}

export function prepareUpdateData(
  req,
  existingPool,
  parsedWaterOpen,
  parsedManualPumpOn,
) {
  const { name, zoneCode, dimensionsText, cubicMeters } = req.body;

  return {
    name,
    zoneCode: zoneCode ? Number(zoneCode) : existingPool.zoneCode,
    dimensionsText,
    cubicMeters:
      cubicMeters !== undefined && cubicMeters !== ""
        ? Number(cubicMeters)
        : null,
    waterOpen:
      parsedWaterOpen === undefined ? existingPool.waterOpen : parsedWaterOpen,
    manualPumpOn:
      parsedManualPumpOn === undefined
        ? existingPool.manualPumpOn
        : parsedManualPumpOn,
    imageUrl: req.file
      ? `/uploads/pools/${req.file.filename}`
      : existingPool.imageUrl,
  };
}

export async function getPools(req, res) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = String(req.query.search || "").trim();
    const sortField = String(req.query.sortField || "createdAt");
    const sortOrder = String(req.query.sortOrder || "DESC").toUpperCase();

    const result = await findPoolsPaginated({
      page,
      limit,
      search,
      sortField,
      sortOrder,
    });

    return res.json(result);
  } catch (error) {
    console.error("GET POOLS ERROR:", error);

    return res.status(500).json({
      message: "No se pudieron recuperar las piscinas",
    });
  }
}

export async function createPoolController(req, res) {
  try {
    const {
      name,
      zoneCode,
      dimensionsText,
      cubicMeters,
      waterOpen,
      manualPumpOn,
    } = req.body;

    if (!name || !zoneCode) {
      return res.status(400).json({
        message: "Nombre y zona son obligatorios",
      });
    }

    if (!isValidZoneCode(zoneCode)) {
      return res.status(400).json({
        message: "Zona inválida",
      });
    }

    const existingPool = await findPoolByName(name);

    if (existingPool) {
      return res.status(409).json({
        message: "Ya existe una piscina con ese nombre",
      });
    }

    const parsedWaterOpen = parseBoolean(waterOpen) ?? false;
    const parsedManualPumpOn = parseBoolean(manualPumpOn) ?? false;

    const imageUrl = req.file ? `/uploads/pools/${req.file.filename}` : null;

    const newPool = await createPool({
      name,
      zoneCode: Number(zoneCode),
      dimensionsText,
      cubicMeters: cubicMeters ? Number(cubicMeters) : null,
      waterOpen: parsedWaterOpen,
      manualPumpOn: parsedManualPumpOn,
      imageUrl,
    });

    return res.status(201).json({
      pool: newPool,
    });
  } catch (error) {
    console.error("CREATE POOL ERROR:", error);

    return res.status(500).json({
      message: "No se pudo crear la piscina",
    });
  }
}

export async function updatePoolController(req, res) {
  try {
    const { id } = req.params;
    const { name, zoneCode, waterOpen, manualPumpOn } = req.body;

    const existingPool = await findPoolById(id);

    const validationError = await validatePoolUpdate(id, name, existingPool);
    if (validationError.error) {
      return res.status(validationError.status).json({
        message: validationError.message,
      });
    }

    const zoneValidation = validateZoneCode(zoneCode);
    if (zoneValidation.error) {
      return res.status(zoneValidation.status).json({
        message: zoneValidation.message,
      });
    }

    const parsedWaterOpen = parseBoolean(waterOpen);
    const parsedManualPumpOn = parseBoolean(manualPumpOn);

    const updateData = prepareUpdateData(
      req,
      existingPool,
      parsedWaterOpen,
      parsedManualPumpOn,
    );

    const updatedPool = await updatePool(id, updateData);

    return res.json({
      pool: updatedPool,
    });
  } catch (error) {
    console.error("UPDATE POOL ERROR:", error);

    return res.status(500).json({
      message: "No se pudo actualizar la piscina",
    });
  }
}

export async function deletePoolController(req, res) {
  try {
    const { id } = req.params;

    const deleted = await deletePool(id);

    if (!deleted) {
      return res.status(404).json({
        message: "Piscina no encontrada",
      });
    }

    return res.json({
      message: "Piscina eliminada correctamente",
    });
  } catch (error) {
    console.error("DELETE POOL ERROR:", error);

    return res.status(500).json({
      message: "No se pudo eliminar la piscina",
    });
  }
}

export async function removePoolImageController(req, res) {
  try {
    const { id } = req.params;

    const pool = await removePoolImage(id);

    if (!pool) {
      return res.status(404).json({
        message: "Piscina no encontrada",
      });
    }

    return res.json({
      message: "Imagen eliminada",
    });
  } catch (error) {
    console.error("REMOVE POOL IMAGE ERROR:", error);

    return res.status(500).json({
      message: "No se pudo eliminar la imagen",
    });
  }
}
