export const WATER_APPEARANCES = [
  { code: "cristalina", name: "Cristalina" },
  { code: "turbia", name: "Turbia" },
  { code: "verde", name: "Verde" },
  { code: "blanquecina", name: "Blanquecina" },
  { code: "amarillenta", name: "Amarillenta" },
];

export const WATER_LEVELS = [
  { code: "bajo", name: "Bajo" },
  { code: "correcto", name: "Correcto" },
  { code: "alto", name: "Alto" },
];

export function isValidWaterAppearance(code) {
  return WATER_APPEARANCES.some((item) => item.code === code);
}

export function isValidWaterLevel(code) {
  return WATER_LEVELS.some((item) => item.code === code);
}
