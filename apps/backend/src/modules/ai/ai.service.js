import { env } from "../../config/env.js";
import { getWeatherByZone } from "../weather/weather.service.js";
import { generateRuleBasedDiagnosis } from "./ai.rules.js";

export async function generatePoolDiagnosis(poolData) {
  const weather = await getWeatherByZone(poolData.zoneName ?? "Mazarrón");
  return generateRuleBasedDiagnosis({
    pool: poolData,
    lastWork: poolData.lastWork,
    weather,
  });

  //LLAMADAS A OLLAMA COMENTADAS PARA NO UTILIZAR POR AHORA, SE DEJARÁN PARA FUTURAS MEJORAS EN LA QUE SE INCLUYA UN ANÁLISIS MÁS PROFUNDO Y PERSONALIZADO DE LOS DATOS DE LA PISCINA Y EL TIEMPO.
  //   const prompt = `
  // Eres un asistente técnico para mantenimiento de piscinas.

  // Analiza los datos de la piscina de forma breve y profesional teniendo también en cuenta el tiempo actual.

  // Datos de la piscina:

  // ${JSON.stringify(poolData, null, 2)}

  // Tiempo actual:

  // ${JSON.stringify(weather, null, 2)}

  // Ten en cuenta que temperaturas altas, humedad, lluvia o calor intenso pueden afectar al cloro, evaporación, nivel del agua y aparición de algas.

  // Datos:
  // ${JSON.stringify(poolData, null, 2)}

  // Devuelve:
  // 1. Estado general
  // 2. Posibles problemas
  // 3. Recomendación de actuación
  // 4. Céntrate en el nivel de agua, la turbidez, el ph, el cloro libre, el cloro total y la alcalinidad, obvia si el agua está abierta y si la bomba está funcionando.
  // 5. Si puedes obtener información del tiempo y temperatura actual de Mazarrón que es donde están todas las piscinas, inclúyela en el análisis.
  // 6. cuando ves pool sustituye por piscina, cuando ves water sustituye por agua, cuando ves temperature sustituye por temperatura, cuando ves weather sustituye por tiempo, cuando ves turbidity sustituye por turbidez, cuando ves alkalinity sustituye por alcalinidad, cuando ves free chlorine sustituye por cloro libre, cuando ves total chlorine sustituye por cloro total.
  // 7. No pidas que te pregunte más información, haz el análisis con lo que tienes ya que no tenemos la opción de interactuar contigo para pedirte más datos.
  // `;

  //   const response = await fetch(`${env.ollamaUrl}/api/generate`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       model: env.ollamaModel,
  //       prompt,
  //       stream: false,
  //     }),
  //   });

  //   if (!response.ok) {
  //     throw new Error("No se pudo generar el diagnóstico con Ollama");
  //   }

  //   const data = await response.json();

  //   return data.response;
}
