export function getWeatherDescription(code) {
  const codes = {
    0: "Cielo despejado",
    1: "Principalmente despejado",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Niebla",
    51: "Llovizna ligera",
    61: "Lluvia ligera",
    63: "Lluvia moderada",
    65: "Lluvia intensa",
    80: "Chubascos",
    95: "Tormenta",
  };

  return codes[code] ?? "Condición desconocida";
}
