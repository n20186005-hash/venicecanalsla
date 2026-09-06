/**
 * Pure, client-safe helpers shared by the weather module:
 * WMO weather-code classification, unit conversion and Beaufort scale.
 * All numeric thresholds used by the advice engine are METRIC (Celsius / km/h).
 */

export type WmoClass =
  | 'clear'
  | 'partlyCloudy'
  | 'overcast'
  | 'fog'
  | 'drizzle'
  | 'rainLight'
  | 'rainModerate'
  | 'rainHeavy'
  | 'snow'
  | 'thunder';

/** Maps a WMO weather code to a stable message key (see `weather.codes`). */
export function weatherCodeKey(code: number): string {
  const map: Record<number, string> = {
    0: 'clear',
    1: 'mainlyClear',
    2: 'partlyCloudy',
    3: 'overcast',
    45: 'fog',
    48: 'fog',
    51: 'drizzle',
    53: 'drizzle',
    55: 'drizzle',
    56: 'freezingDrizzle',
    57: 'freezingDrizzle',
    61: 'rain',
    63: 'rain',
    65: 'rain',
    66: 'freezingRain',
    67: 'freezingRain',
    71: 'snowfall',
    73: 'snowfall',
    75: 'snowfall',
    77: 'snowGrains',
    80: 'showers',
    81: 'showers',
    82: 'showers',
    85: 'snowShowers',
    86: 'snowShowers',
    95: 'thunderstorm',
    96: 'thunderstormHail',
    99: 'thunderstormHail',
  };
  return map[code] ?? 'clear';
}

/** Maps a WMO code to a severity class used by the advice engine. */
export function weatherCodeClass(code: number): WmoClass {
  if (code === 0 || code === 1) return 'clear';
  if (code === 2) return 'partlyCloudy';
  if (code === 3) return 'overcast';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 57) return 'drizzle';
  if (code === 61 || code === 66 || code === 80) return 'rainLight';
  if (code === 63 || code === 67 || code === 81) return 'rainModerate';
  if (code === 65 || code === 82) return 'rainHeavy';
  if (code >= 95 && code <= 99) return 'thunder';
  return 'snow'; // 71-77, 85, 86 and anything unhandled
}

/* ---- Unit conversion (metric internal -> US display) ---- */
export const cToF = (c: number): number => (c * 9) / 5 + 32;
export const kmhToMph = (kmh: number): number => kmh / 1.609344;
export const mToFt = (m: number): number => m * 3.28084;

/** Wind speed (km/h) -> Beaufort scale number (0-12). */
export function beaufortFromKmh(kmh: number): number {
  if (!Number.isFinite(kmh) || kmh <= 0) return 0;
  const ms = kmh / 3.6;
  const bft = Math.round(Math.pow(ms / 0.836, 2 / 3));
  return Math.min(12, Math.max(0, bft));
}

/** UV index -> display level key under `weather.uvLevels`. */
export function uvLevel(uv: number): 'low' | 'moderate' | 'high' | 'veryHigh' | 'extreme' {
  if (uv >= 11) return 'extreme';
  if (uv >= 8) return 'veryHigh';
  if (uv >= 6) return 'high';
  if (uv >= 3) return 'moderate';
  return 'low';
}
