export async function getWeatherByZone(zoneName) {
  const geoUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");

  geoUrl.searchParams.set("name", zoneName);
  geoUrl.searchParams.set("count", "1");
  geoUrl.searchParams.set("language", "es");
  geoUrl.searchParams.set("format", "json");

  const geoResponse = await fetch(geoUrl);

  if (!geoResponse.ok) {
    throw new Error("No se pudo obtener la ubicación");
  }

  const geoData = await geoResponse.json();
  const location = geoData.results?.[0];

  if (!location) {
    return null;
  }

  const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");

  weatherUrl.searchParams.set("latitude", String(location.latitude));
  weatherUrl.searchParams.set("longitude", String(location.longitude));
  weatherUrl.searchParams.set(
    "current",
    "temperature_2m,relative_humidity_2m,precipitation,weather_code",
  );
  weatherUrl.searchParams.set("timezone", "auto");

  const weatherResponse = await fetch(weatherUrl);

  if (!weatherResponse.ok) {
    throw new Error("No se pudo obtener el tiempo");
  }

  const weatherData = await weatherResponse.json();

  return {
    zone: location.name,
    country: location.country,
    latitude: location.latitude,
    longitude: location.longitude,
    temperature: weatherData.current?.temperature_2m,
    humidity: weatherData.current?.relative_humidity_2m,
    precipitation: weatherData.current?.precipitation,
    weatherCode: weatherData.current?.weather_code,
    time: weatherData.current?.time,
  };
}
