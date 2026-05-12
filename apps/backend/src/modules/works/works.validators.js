import {
  isValidWaterAppearance,
  isValidWaterLevel,
} from "../../constants/works.js";

function isEmpty(value) {
  return value === undefined || value === null || value === "";
}

function isInvalidNumber(value) {
  return isEmpty(value) || Number.isNaN(Number(value));
}

export function validateStartWork(poolId) {
  if (isEmpty(poolId)) {
    return {
      error: true,
      status: 400,
      message: "La piscina es obligatoria",
    };
  }

  return { error: false };
}

export function validateFinishWork(data) {
  const {
    ph,
    freeChlorine,
    totalChlorine,
    alkalinity,
    waterAppearance,
    waterLevel,
    waterOpen,
    manualPumpOn,
    comment,
  } = data;

  if (isInvalidNumber(ph)) {
    return {
      error: true,
      status: 400,
      message: "El pH es obligatorio",
    };
  }

  if (isInvalidNumber(freeChlorine)) {
    return {
      error: true,
      status: 400,
      message: "El cloro libre es obligatorio",
    };
  }

  if (isInvalidNumber(totalChlorine)) {
    return {
      error: true,
      status: 400,
      message: "El cloro total es obligatorio",
    };
  }

  if (isInvalidNumber(alkalinity)) {
    return {
      error: true,
      status: 400,
      message: "La alcalinidad es obligatoria",
    };
  }

  if (isEmpty(waterAppearance)) {
    return {
      error: true,
      status: 400,
      message: "El estado del agua es obligatorio",
    };
  }

  if (!isValidWaterAppearance(waterAppearance)) {
    return {
      error: true,
      status: 400,
      message: "El estado del agua no es válido",
    };
  }

  if (isEmpty(waterLevel)) {
    return {
      error: true,
      status: 400,
      message: "El nivel del agua es obligatorio",
    };
  }

  if (!isValidWaterLevel(waterLevel)) {
    return {
      error: true,
      status: 400,
      message: "El nivel del agua no es válido",
    };
  }

  if (waterOpen !== "0" && waterOpen !== "1") {
    return {
      error: true,
      status: 400,
      message: "Debe indicar si el agua queda abierta o cerrada",
    };
  }

  if (manualPumpOn !== "0" && manualPumpOn !== "1") {
    return {
      error: true,
      status: 400,
      message: "Debe indicar el estado de la bomba",
    };
  }

  if (!isEmpty(comment) && String(comment).trim().length > 1000) {
    return {
      error: true,
      status: 400,
      message: "El comentario no puede superar 1000 caracteres",
    };
  }

  return { error: false };
}
