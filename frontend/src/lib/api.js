const baseURL = process.env.ENDPOINT;

export default async function getWeatherFromApi(lat, long) {
  let response;

  try {
    if (lat && long) {
      response = await fetch(`${baseURL}/weather?lat=${lat}&long=${long}`);
    } else {
      response = await fetch(`${baseURL}/weather`);
    }
    const data = await response.json();
    if (data) {
      return data;
    }
  } catch (error) {
    /* eslint no-console: ["error", { allow: ["warn", "error"] }] */
    console.error(error);
  }

  return {};
}
