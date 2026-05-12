import type { ErrorValidation, CampoValidable } from "../types/types";

function estaVacio(value: unknown): boolean {
  if (value === null || value === undefined) return true;

  if (typeof value === "string") {
    return value.trim() === "";
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  return false;
}

function esCampoValidable(obj: unknown): obj is CampoValidable {
  return (
    !!obj &&
    typeof obj === "object" &&
    "mandatory" in obj &&
    "value" in obj &&
    typeof (obj as CampoValidable).mandatory === "boolean"
  );
}

export function validarObligatorios(
  obj: unknown,
  ruta = "",
): ErrorValidation[] {
  const errores: ErrorValidation[] = [];

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      errores.push(...validarObligatorios(item, `${ruta}[${index}]`));
    });
    return errores;
  }

  if (esCampoValidable(obj)) {
    if (obj.mandatory && estaVacio(obj.value)) {
      errores.push({
        ruta,
        mensaje: `El campo ${ruta || "sin nombre"} es obligatorio`,
      });
    }
    return errores;
  }

  if (obj && typeof obj === "object") {
    Object.entries(obj).forEach(([key, value]) => {
      const nuevaRuta = ruta ? `${ruta}.${key}` : key;
      errores.push(...validarObligatorios(value, nuevaRuta));
    });
  }

  return errores;
}
