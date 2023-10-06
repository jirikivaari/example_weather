let baseURL;

if (process.env.ENDPOINT) {
  baseURL = process.env.ENDPOINT;
} else if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-undef, quotes
  baseURL = `http://$(window.location.host):9000/api`;
} else {
  baseURL = 'http://localhost:9000/api';
}

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
