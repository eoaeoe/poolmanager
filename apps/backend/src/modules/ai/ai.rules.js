export function generateRuleBasedDiagnosis({ pool, lastWork, weather }) {
  const criticals = [];
  const alerts = [];
  const positives = [];

  if (!lastWork) {
    return {
      title: "Diagnóstico automático",
      criticals: [],
      alerts: ["No existen mantenimientos registrados para esta piscina."],
      positives: [],
    };
  }

  const ph = Number(lastWork.ph);
  const freeChlorine = Number(lastWork.freeChlorine);
  const totalChlorine = Number(lastWork.totalChlorine);
  const alkalinity = Number(lastWork.alkalinity);

  const combinedChlorine = totalChlorine - freeChlorine;

  const temperature = Number(weather?.temperature);

  if (ph < 7) {
    alerts.push("El pH está bajo. Puede provocar irritación y corrosión.");
  }

  if (ph >= 7.2 && ph <= 7.6) {
    positives.push("El pH se encuentra en un rango correcto.");
  }

  if (ph > 7.8) {
    alerts.push("El pH está alto. El cloro pierde eficacia desinfectante.");
  }

  if (ph >= 8.4) {
    criticals.push(
      "El pH es muy elevado. Se recomienda corregirlo urgentemente.",
    );
  }

  if (freeChlorine < 0.5) {
    criticals.push(
      "El cloro libre es muy bajo. Riesgo elevado de mala desinfección.",
    );
  } else if (freeChlorine < 1) {
    alerts.push("El cloro libre está por debajo del rango recomendado.");
  } else if (freeChlorine <= 3) {
    positives.push("El cloro libre está en un rango adecuado.");
  }

  if (freeChlorine > 4) {
    alerts.push("El cloro libre es elevado. Puede provocar irritación.");
  }

  if (combinedChlorine > 0.6) {
    alerts.push(
      "Existe una diferencia elevada entre cloro total y libre. Posible presencia de cloraminas.",
    );
  }

  // ALCALINIDAD

  if (alkalinity < 80) {
    alerts.push("La alcalinidad está baja. El pH puede volverse inestable.");
  }

  if (alkalinity >= 80 && alkalinity <= 120) {
    positives.push("La alcalinidad está en un rango correcto.");
  }

  if (alkalinity > 160) {
    alerts.push(
      "La alcalinidad es elevada. Puede dificultar la corrección del pH.",
    );
  }

  if (lastWork.waterAppearance === "verde") {
    criticals.push(
      "El agua presenta coloración verde. Posible proliferación de algas.",
    );
  }

  if (lastWork.waterAppearance === "turbia") {
    alerts.push(
      "El agua está turbia. Revisar filtración y parámetros químicos.",
    );
  }

  if (lastWork.waterAppearance === "cristalina") {
    positives.push("El agua presenta un aspecto visual correcto.");
  }

  if (lastWork.waterLevel === "bajo") {
    alerts.push(
      "El nivel del agua es bajo. Puede afectar al funcionamiento de la depuradora.",
    );
  }

  if (lastWork.waterLevel === "alto") {
    alerts.push(
      "El nivel del agua es elevado. Revisar skimmers y circulación.",
    );
  }

  if (temperature >= 35) {
    alerts.push(
      "La temperatura exterior es alta. Puede aumentar evaporación y consumo de cloro.",
    );
  }

  if (temperature >= 35 && weather?.humidity >= 70) {
    alerts.push(
      "Las condiciones ambientales actuales favorecen el deterioro más rápido de la calidad del agua.",
    );
  }

  if (weather?.precipitation > 0) {
    alerts.push(
      "La lluvia puede alterar los parámetros químicos del agua y reducir la efectividad del cloro.",
    );
  }

  if (weather?.description?.toLowerCase().includes("rain")) {
    alerts.push(
      "Se detecta lluvia. Los parámetros del agua podrían alterarse.",
    );
  }

  if (pool.waterOpen) {
    alerts.push("La piscina tiene el agua marcada como abierta.");
  }

  if (pool.manualPumpOn) {
    alerts.push("La bomba está funcionando en modo manual.");
  }

  return {
    title: "Diagnóstico automático",
    criticals,
    alerts,
    positives,
  };
}
