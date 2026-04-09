export const poolZoneOptions = [
  { label: "Isla Plana", value: 1 },
  { label: "La Azohía", value: 2 },
  { label: "Mazarrón", value: 3 },
  { label: "Puerto de Mazarrón", value: 4 },
];

export function getZoneNameByCode(code: number | null | undefined) {
  return poolZoneOptions.find((zone) => zone.value === code)?.label ?? "-";
}
