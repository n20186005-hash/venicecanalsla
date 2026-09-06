/**
 * Server-side live weather for the Venice canal district.
 *
 * Combines two free Open-Meteo endpoints (no API key):
 *  1. Forecast API (on-shore conditions, current + 7 days, rain/UV/wind)
 *  2. Marine API (Venice Beach sea-surface temperature + wave height)
 *
 * All values are normalized to METRIC units (Celsius / km/h / meters), so the
 * advice engine and the UI can convert independently. It is only meant to be
 * called from the `/api/weather` route handler at request time - the page
 * itself is statically prerendered, so the browser fetches this endpoint and
 * always gets fresh conditions (cached for ~10 minutes on the server).
 */

export interface WeatherDay {
  date: string; // YYYY-MM-DD in America/Los_Angeles
  code: number;
  tempMaxC: number;
  tempMinC: number;
  precipProb: number; // % (max of the day)
  uvIndex: number; // max of the day
  windKmhMax: number; // max 10 m wind of the day
}

export interface LiveWeather {
  fetchedAt: string; // ISO 8601 (UTC) - time the data was fetched
  timezone: string;
  current: {
    temperatureC: number;
    feelsLikeC: number;
    humidity: number; // %
    windKmh: number;
    code: number;
    precipProb: number; // %
    uvIndex: number;
    isDay: boolean;
  };
  daily: WeatherDay[];
  sea: {
    tempC: number;
    waveM: number; // current wave height
    waveMaxM: number; // max expected later today
  } | null;
}

const FORECAST_LAT = 33.9833582;
const FORECAST_LON = -118.4723585;
const MARINE_LAT = 33.9855; // Venice Beach shoreline grid cell
const MARINE_LON = -118.469;

async function fetchJson(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, {
      headers: { accept: 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getLiveWeather(): Promise<LiveWeather | null> {
  const forecastParams = new URLSearchParams({
    latitude: String(FORECAST_LAT),
    longitude: String(FORECAST_LON),
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,precipitation_probability,wind_speed_10m,uv_index,is_day',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,wind_speed_10m_max',
    timezone: 'America/Los_Angeles',
    forecast_days: '7',
  });

  const marineParams = new URLSearchParams({
    latitude: String(MARINE_LAT),
    longitude: String(MARINE_LON),
    hourly: 'sea_surface_temperature,wave_height',
    timezone: 'America/Los_Angeles',
    forecast_days: '1',
  });

  const [forecast, marine] = await Promise.all([
    fetchJson(`https://api.open-meteo.com/v1/forecast?${forecastParams.toString()}`),
    fetchJson(`https://marine-api.open-meteo.com/v1/marine?${marineParams.toString()}`),
  ]);

  if (!forecast?.current || !forecast?.daily) return null;

  const c = forecast.current;
  const d = forecast.daily;
  const daily: WeatherDay[] = (d.time as string[]).map((date, i) => ({
    date,
    code: Number(d.weather_code?.[i] ?? 0),
    tempMaxC: Number(d.temperature_2m_max?.[i] ?? 0),
    tempMinC: Number(d.temperature_2m_min?.[i] ?? 0),
    precipProb: Number(d.precipitation_probability_max?.[i] ?? 0),
    uvIndex: Number(d.uv_index_max?.[i] ?? 0),
    windKmhMax: Number(d.wind_speed_10m_max?.[i] ?? 0),
  }));

  let sea: LiveWeather['sea'] = null;
  if (marine?.hourly && Array.isArray(marine.hourly.time)) {
    const times: string[] = marine.hourly.time;
    const temps: number[] = marine.hourly.sea_surface_temperature ?? [];
    const waves: number[] = marine.hourly.wave_height ?? [];
    const hour = Number((c.time as string).slice(11, 13));
    const idx = Math.min(Math.max(hour, 0), times.length - 1);

    const pick = (arr: number[], i: number): number | null => {
      const v = arr[i];
      if (Number.isFinite(v)) return Number(v);
      for (const x of arr) if (Number.isFinite(x)) return Number(x);
      return null;
    };
    const maxOf = (arr: number[]): number | null => {
      const valid = arr.filter((x) => Number.isFinite(x));
      return valid.length ? Math.max(...valid) : null;
    };

    const tempC = pick(temps, idx);
    const waveM = pick(waves, idx);
    const waveMaxM = maxOf(waves);
    if (tempC !== null || waveM !== null) {
      sea = {
        tempC: tempC ?? 0,
        waveM: waveM ?? 0,
        waveMaxM: waveMaxM ?? waveM ?? 0,
      };
    }
  }

  return {
    fetchedAt: new Date().toISOString(),
    timezone: String(forecast.timezone ?? 'America/Los_Angeles'),
    current: {
      temperatureC: Number(c.temperature_2m ?? 0),
      feelsLikeC: Number(c.apparent_temperature ?? 0),
      humidity: Number(c.relative_humidity_2m ?? 0),
      windKmh: Number(c.wind_speed_10m ?? 0),
      code: Number(c.weather_code ?? 0),
      precipProb: Number(c.precipitation_probability ?? 0),
      uvIndex: Number(c.uv_index ?? 0),
      isDay: c.is_day === 1,
    },
    daily,
    sea,
  };
}
