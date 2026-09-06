/**
 * Rule engine that turns one day of weather into actionable, visitor-facing
 * tips for the Venice canals (urban + beach-adjacent scene).
 *
 * The returned strings are translation keys nested under `weather.advice`
 * (e.g. category "dress" + key "hot" -> message `weather.advice.dress.hot`).
 *
 * Rules follow the product spec and are intentionally METRIC:
 *   - rain probability >= 60%
 *   - high temperature >= 32 C, heat risk >= 37 C, cold when max <= 10 C
 *   - day/night swing > 8 C
 *   - UV index >= 5 (>= 7 for the sun hat)
 *   - Beaufort 5-6 (windy), >= 7 (strong wind risk)
 *   - sea: waves >= 1.5 m (avoid swimming), >= 2 m (risk banner)
 */

import { weatherCodeClass, beaufortFromKmh, type WmoClass } from './wmo';

export interface WeatherAdviceDay {
  code: number;
  tempMaxC: number;
  tempMinC: number;
  precipProb: number;
  uvIndex: number;
  windKmh: number;
}

export interface WeatherAdviceContext {
  day: WeatherAdviceDay;
  /** Today only: live wave height in meters (null when not available). */
  waveHeightM: number | null;
}

export interface WeatherAdvice {
  dress: string[];
  plan: string[];
  carry: string[];
  risk: string[];
}

const RISKY_RAIN = new Set<WmoClass>(['rainModerate', 'rainHeavy']);
const LIGHT_RAIN = new Set<WmoClass>(['drizzle', 'rainLight']);

export function getWeatherAdvice(ctx: WeatherAdviceContext): WeatherAdvice {
  const { day, waveHeightM } = ctx;
  const cls = weatherCodeClass(day.code);
  const swing = day.tempMaxC - day.tempMinC;
  const bft = beaufortFromKmh(day.windKmh);

  const hot = day.tempMaxC >= 32;
  const heatRisk = day.tempMaxC >= 37;
  const cold = day.tempMaxC <= 10;
  const heavyRain = RISKY_RAIN.has(cls) || cls === 'thunder';
  const lightRain = LIGHT_RAIN.has(cls);
  const foggy = cls === 'fog';
  const waveBig = waveHeightM !== null && waveHeightM >= 1.5;
  const waveHuge = waveHeightM !== null && waveHeightM >= 2;

  const dress: string[] = [];
  const plan: string[] = [];
  const carry: string[] = [];
  const risk: string[] = [];

  /* ---------- What to wear ---------- */
  if (hot) dress.push('hot');
  else if (cold) dress.push('cold');
  else if (swing > 8) dress.push('cool');
  if (lightRain && !heavyRain) dress.push('rainLight');
  if (heavyRain) dress.push('rainHeavy');
  if (bft >= 5 && bft <= 6) dress.push('wind');
  if (dress.length === 0) dress.push('baseline');

  /* ---------- How to plan the visit ---------- */
  if (cls === 'clear') plan.push('sunny');
  else if (cls === 'partlyCloudy' || cls === 'overcast') plan.push('cloudy');
  if (foggy) plan.push('fog');
  if (day.precipProb >= 60) plan.push('rainHigh');
  if (lightRain && !heavyRain) plan.push('rainLight');
  if (heavyRain) plan.push('rainHeavy');
  if (cls === 'thunder') plan.push('thunder');
  if (bft >= 5) plan.push('wind');
  if (hot) plan.push('hot');
  if (waveBig) plan.push('roughSea');
  if (plan.length === 0) plan.push('baseline');

  /* ---------- Things to pack ---------- */
  if (day.precipProb >= 60) carry.push('umbrella');
  if (lightRain) carry.push('compactUmbrella');
  if (heavyRain) carry.push('raincoat');
  if (day.uvIndex >= 5 || hot) carry.push('sunblock');
  if (day.uvIndex >= 5) carry.push('sunglasses');
  if (day.uvIndex >= 7 || day.tempMaxC >= 35) carry.push('hat');
  if (hot) carry.push('water');
  if (swing > 8 && !hot) carry.push('layer');
  if (cold) carry.push('warm');
  if (foggy) carry.push('mask');
  if (cls === 'clear' || cls === 'partlyCloudy' || cls === 'overcast') carry.push('camera');
  if (carry.length === 0) carry.push('baseline');

  /* ---------- Risk banner (red, top priority) ---------- */
  if (heavyRain) risk.push('heavyRain');
  if (cls === 'thunder') risk.push('thunder');
  if (bft >= 7) risk.push('strongWind');
  if (foggy) risk.push('denseFog');
  if (heatRisk) risk.push('heat');
  if (waveHuge) risk.push('roughSea');

  return {
    dress: Array.from(new Set(dress)),
    plan: Array.from(new Set(plan)),
    carry: Array.from(new Set(carry)),
    risk: Array.from(new Set(risk)),
  };
}
