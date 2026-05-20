import { getWeatherByZone } from "../weather/weather.service.js";
import { generateRuleBasedDiagnosis } from "./ai.rules.js";
import { openai } from "../../lib/openai.js";

function generateFallbackDiagnosis(data, weather) {
  return generateRuleBasedDiagnosis({
    pool: data.pool,
    lastWork: data.lastWork,
    weather,
  });
}

export async function generatePoolDiagnosis(data) {
  const weather = await getWeatherByZone(data.zoneName ?? "Mazarrón");
  try {
    const prompt = `
Actúa como un técnico profesional de mantenimiento de piscinas.
Analiza esta información y genera un diagnóstico breve.
No tengas en cuenta si el agua está abierta o no o si la bomba está encendida o no, solo analiza los datos químicos, estado del agua y nivel y el clima.
DATOS:
${JSON.stringify(data, null, 2)}

Clima actual:
- Temperatura: ${weather?.temperature ?? "N/D"} ºC,
- Humedad: ${weather?.humidity ?? "N/D"} %,
- Estado: ${weather?.description ?? "N/D"},
- Viento: ${weather?.windSpeed ?? "N/D"} m/s,
- Precipitación: ${weather?.precipitation ?? "N/D"} mm/h,
Responde SOLO en JSON válido con este formato:
{
  "title": "Diagnóstico automático",
  "criticals": [],
  "alerts": [],
  "positives": []
}`;
    const response = await openai.chat.completions.create(
      {
        model: "gpt-4.1-mini",
        temperature: 0.2,
        response_format: {
          type: "json_object",
        },
        messages: [
          {
            role: "system",
            content:
              "Eres un experto en mantenimiento profesional de piscinas. Responde siempre en JSON válido.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        timeout: 10000,
      },
    );
    const content = response.choices[0]?.message?.content;
    if (!content) {
      return generateFallbackDiagnosis(data, weather);
    }
    const diagnosis = JSON.parse(content);
    if (
      !diagnosis ||
      !Array.isArray(diagnosis.criticals) ||
      !Array.isArray(diagnosis.alerts) ||
      !Array.isArray(diagnosis.positives)
    ) {
      return generateFallbackDiagnosis(data, weather);
    }
    return diagnosis;
  } catch (error) {
    console.error("OPENAI DIAGNOSIS ERROR, USING FALLBACK:", {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.type,
    });
    return generateFallbackDiagnosis(data, weather);
  }
}
