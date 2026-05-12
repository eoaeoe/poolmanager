export const WATER_APPEARANCES = [
  { code: "cristalina", name: "Cristalina" },
  { code: "turbia", name: "Turbia" },
  { code: "verde", name: "Verde" },
  { code: "blanquecina", name: "Blanquecina" },
  { code: "amarillenta", name: "Amarillenta" },
] as const;

export const WATER_LEVELS = [
  { code: "bajo", name: "Bajo" },
  { code: "correcto", name: "Correcto" },
  { code: "alto", name: "Alto" },
] as const;

export const YES_NO_OPTIONS = [
  { code: "1", name: "Sí" },
  { code: "0", name: "No" },
] as const;

export const LEVEL_COLOR_PRESETS = {
  totalChlorine: [
    { color: "#d4c481", value: 0 },
    { color: "#ccc688", value: 0.5 },
    { color: "#c2c385", value: 1 },
    { color: "#a1b783", value: 3 },
    { color: "#88ae86", value: 5 },
    { color: "#71a27d", value: 10 },
  ],
  freeChlorine: [
    { color: "#d2ceab", value: 0 },
    { color: "#c0b899", value: 0.5 },
    { color: "#c0b1a6", value: 1 },
    { color: "#a489a5", value: 3 },
    { color: "#885888", value: 5 },
    { color: "#683365", value: 10 },
    { color: "#4c2653", value: 20 },
  ],
  ph: [
    { color: "#d99149", value: 6.2 },
    { color: "#d86d3a", value: 6.8 },
    { color: "#c74b29", value: 7.2 },
    { color: "#c84a44", value: 7.8 },
    { color: "#c82f40", value: 8.4 },
  ],
  alkalinity: [
    { color: "#cc9b48", value: 0 },
    { color: "#a99b49", value: 40 },
    { color: "#7c8040", value: 80 },
    { color: "#6d7d5f", value: 120 },
    { color: "#436353", value: 180 },
    { color: "#3b5856", value: 240 },
  ],
};
