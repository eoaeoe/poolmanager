export const ZONES = [
  { code: 1, name: "Isla Plana" },
  { code: 2, name: "La Azohía" },
  { code: 3, name: "Mazarrón" },
  { code: 4, name: "Puerto de Mazarrón" },
];

export function isValidZoneCode(code) {
  return ZONES.some((zone) => zone.code === Number(code));
}
