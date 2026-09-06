'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { LiveWeather } from '@/lib/weather';
import { getWeatherAdvice } from '@/lib/weatherAdvice';
import {
  beaufortFromKmh,
  cToF,
  kmhToMph,
  mToFt,
  uvLevel,
  weatherCodeClass,
  weatherCodeKey,
  type WmoClass,
} from '@/lib/wmo';

type AdviceCategory = 'dress' | 'plan' | 'carry';

/* ------------------------------------------------------------------ */
/* Tiny inline icon set (no external icon dependency)                  */
/* ------------------------------------------------------------------ */

const CLOUD_PATH =
  'M15 32a7 7 0 0 1-.6-13.9 9.5 9.5 0 0 1 17.9-1.6A6.5 6.5 0 0 1 33 32Z';

function Glyph({ cls, size = 56 }: { cls: WmoClass; size?: number }) {
  const cloud = <path d={CLOUD_PATH} />;
  let body: ReactNode;
  switch (cls) {
    case 'clear':
      body = (
        <>
          <circle cx="24" cy="22" r="6.5" />
          <path d="M24 4v6M24 34v6M4 22h6M38 22h6M10.4 8.4l4.2 4.2M33.4 31.4l4.2 4.2M37.6 8.4l-4.2 4.2M14.6 31.4l-4.2 4.2" />
        </>
      );
      break;
    case 'partlyCloudy':
      body = (
        <>
          <path d={CLOUD_PATH} transform="translate(10,8) scale(0.92)" />
          <circle cx="17" cy="13" r="4.5" />
          <path d="M17 3v3M6.6 6.6l2 2M28.2 6.6l-2.1 2M4.5 15h3" />
        </>
      );
      break;
    case 'fog':
    case 'overcast':
      body = (
        <>
          {cloud}
          <path d="M13 37h22M16 42h16" />
        </>
      );
      break;
    case 'drizzle':
      body = (
        <>
          {cloud}
          <path d="M18 35l-2.5 5M25 35l-2.5 5M32 35l-2.5 5" strokeWidth="2.2" />
        </>
      );
      break;
    case 'rainLight':
    case 'rainModerate':
    case 'rainHeavy':
      body = (
        <>
          {cloud}
          <path d="M16 34l-3 7M24.5 34l-3 7M33 34l-3 7" strokeWidth="2.2" />
        </>
      );
      break;
    case 'thunder':
      body = (
        <>
          {cloud}
          <path d="M28 31l-7 8h5l-3.5 8 9-9h-5l2.5-7Z" strokeLinejoin="round" />
        </>
      );
      break;
    case 'snow':
      body = (
        <>
          {cloud}
          <path d="M17 35l2 2M17 39l2-2M25 37l2 2M25 41l2-2M33 35l2 2M33 39l2-2" strokeWidth="1.8" />
        </>
      );
      break;
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {body}
    </svg>
  );
}

function UmbrellaIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 12a11.05 11.05 0 0 0-22 0ZM12 12v8a2 2 0 0 0 4 0" />
    </svg>
  );
}

function DropletIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.7 6.4 9a6.9 6.9 0 0 0 11.2 0Z" />
    </svg>
  );
}

function WindIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h9a3 3 0 1 0-3-3M3 12h14a3 3 0 1 1-3 3M3 16h6a2.5 2.5 0 1 1-2.5 2.5" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
    </svg>
  );
}

function ThermometerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 2v12.5a4 4 0 1 0 4 4c0-1.2-.5-2.2-1.3-3" />
      <path d="M14 14.5V6a2 2 0 0 0-4 0v8.5" />
    </svg>
  );
}

function WaveIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 8c2 0 2 1.5 4 1.5S8 8 10 8s2 1.5 4 1.5S16 8 18 8s2 1.5 4 1.5" />
      <path d="M2 15c2 0 2 1.5 4 1.5S8 15 10 15s2 1.5 4 1.5S16 15 18 15s2 1.5 4 1.5" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

function windLevelKey(bft: number): 'calm' | 'gentle' | 'fresh' | 'strong' {
  if (bft >= 7) return 'strong';
  if (bft >= 5) return 'fresh';
  if (bft >= 3) return 'gentle';
  return 'calm';
}

function dayLabelFn(dateStr: string, index: number, todayText: string, locale: string): string {
  if (index === 0) return todayText;
  const dt = new Date(`${dateStr}T12:00:00Z`);
  if (Number.isNaN(dt.getTime())) return dateStr;
  const weekday = dt.toLocaleDateString(locale, { weekday: 'short', timeZone: 'UTC' });
  const dayNum = dt.toLocaleDateString(locale, { month: 'numeric', day: 'numeric', timeZone: 'UTC' });
  return `${weekday} ${dayNum}`;
}

function fmtTempC(c: number): string {
  return `${Math.round(cToF(c))}°F`;
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export default function WeatherSection() {
  const t = useTranslations('weather');
  const locale = useLocale();
  const [data, setData] = useState<LiveWeather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/weather', { cache: 'no-store' });
      if (!res.ok) throw new Error('weather unavailable');
      const json = (await res.json()) as { ok: boolean; data?: LiveWeather };
      if (!json.ok || !json.data) throw new Error('weather unavailable');
      setData(json.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const day = data?.daily[activeIdx] ?? null;
  const isToday = activeIdx === 0;

  const advice = useMemo(() => {
    if (!data || !day) return null;
    const c = data.current;
    const windKmh = isToday ? Math.max(c.windKmh, day.windKmhMax) : day.windKmhMax;
    const code = isToday ? c.code : day.code;
    const precipProb = isToday ? Math.max(c.precipProb, day.precipProb) : day.precipProb;
    return getWeatherAdvice({
      day: {
        code,
        tempMaxC: day.tempMaxC,
        tempMinC: day.tempMinC,
        precipProb,
        uvIndex: day.uvIndex,
        windKmh,
      },
      waveHeightM: isToday ? data.sea?.waveMaxM ?? null : null,
    });
  }, [data, day, isToday]);

  const catLabels: Record<AdviceCategory, { title: string; icon: ReactNode }> = {
    dress: { title: t('advice.whatToWear'), icon: <WindIcon /> },
    plan: { title: t('advice.planVisit'), icon: <WaveIcon /> },
    carry: { title: t('advice.packList'), icon: <UmbrellaIcon /> },
  };
  const catKeys: AdviceCategory[] = ['dress', 'plan', 'carry'];

  return (
    <section id="weather" className="section-padding" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h2
              className="font-display text-3xl sm:text-4xl font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('title')}
            </h2>
            <p className="text-base leading-relaxed mt-3 max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
              {t('subtitle')}
            </p>
          </div>
          {data && (
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="text-sm font-medium px-3 py-1.5 rounded-full border flex items-center gap-2 disabled:opacity-60"
              style={{ borderColor: 'var(--border-color)', color: 'var(--accent)' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6" />
              </svg>
              {t('refresh')}
            </button>
          )}
        </div>
        <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />

        {loading && !data ? (
          <div
            className="rounded-xl p-6 text-sm animate-pulse"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
          >
            {t('loading')}
          </div>
        ) : error && !data ? (
          <div
            className="rounded-xl p-6"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
          >
            <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              {t('unavailableTitle')}
            </p>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              {t('unavailableDesc')}
            </p>
            <button
              type="button"
              onClick={load}
              className="px-4 py-2 rounded-full text-sm font-medium text-white"
              style={{ background: 'var(--accent)' }}
            >
              {t('retry')}
            </button>
          </div>
        ) : data && day && advice ? (
          <div>
            {/* ------- Current / selected-day summary ------- */}
            <div
              className="rounded-2xl p-6 sm:p-7"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex items-center gap-5">
                  <span style={{ color: isToday ? 'var(--accent)' : 'var(--text-primary)' }}>
                    <Glyph cls={weatherCodeClass(isToday ? data.current.code : day.code)} size={64} />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
                      {isToday ? t('now') : dayLabelFn(day.date, activeIdx, t('today'), locale)}
                    </p>
                    <p className="font-display font-bold text-5xl leading-none" style={{ color: 'var(--text-primary)' }}>
                      {fmtTempC(isToday ? data.current.temperatureC : day.tempMaxC)}
                    </p>
                    <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {t(`codes.${weatherCodeKey(isToday ? data.current.code : day.code)}`)}
                      {isToday
                        ? ` · ${t('high')} ${fmtTempC(day.tempMaxC)} / ${t('low')} ${fmtTempC(day.tempMinC)}`
                        : ` · ${t('low')} ${fmtTempC(day.tempMinC)}`}
                      {isToday && (
                        <span className="ml-1 block sm:inline sm:ml-2" style={{ color: 'var(--text-muted)' }}>
                          {t('feelsLike')} {fmtTempC(data.current.feelsLikeC)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* metric chips */}
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Chip
                    icon={<UmbrellaIcon />}
                    label={t('precip')}
                    value={`${Math.round(isToday ? data.current.precipProb : day.precipProb)}%`}
                    tone="water"
                  />
                  <Chip
                    icon={<WindIcon />}
                    label={t('wind')}
                    value={`${Math.round(kmhToMph(isToday ? data.current.windKmh : day.windKmhMax))} mph`}
                    sub={t(`windLevel.${windLevelKey(beaufortFromKmh(isToday ? data.current.windKmh : day.windKmhMax))}`)}
                    tone="autumn"
                  />
                  <Chip
                    icon={<SunIcon />}
                    label={t('uv')}
                    value={`${Math.round(day.uvIndex)}`}
                    sub={t(`uvLevels.${uvLevel(day.uvIndex)}`)}
                    tone="autumn"
                  />
                  {isToday && (
                    <Chip
                      icon={<DropletIcon />}
                      label={t('humidity')}
                      value={`${Math.round(data.current.humidity)}%`}
                      tone="water"
                    />
                  )}
                  {isToday && data.sea && (
                    <div
                      className="rounded-xl px-4 py-3 flex items-center gap-3 sm:col-span-2 lg:col-span-3"
                      style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
                    >
                      <span style={{ color: 'var(--color-water-600, var(--accent))' }}>
                        <WaveIcon />
                      </span>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                          {t('sea')}
                        </span>{' '}
                        · {t('seaTemp')} {fmtTempC(data.sea.tempC)} · {t('waveHeight')}{' '}
                        {mToFt(data.sea.waveMaxM).toFixed(1)} ft
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ------- 7-day selector ------- */}
            <div className="flex gap-3 mt-6 overflow-x-auto pb-2 -mx-1 px-1">
              {data.daily.map((d, i) => {
                const active = i === activeIdx;
                return (
                  <button
                    key={d.date}
                    type="button"
                    onClick={() => setActiveIdx(i)}
                    className="flex-shrink-0 flex flex-col items-center gap-1.5 rounded-xl px-4 py-3 min-w-[76px]"
                    style={{
                      background: active ? 'var(--bg-secondary)' : 'transparent',
                      border: `1px solid ${active ? 'var(--accent)' : 'var(--border-color)'}`,
                      color: active ? 'var(--accent)' : 'var(--text-primary)',
                    }}
                    aria-pressed={active}
                  >
                    <span className="text-xs font-medium whitespace-nowrap">
                      {dayLabelFn(d.date, i, t('today'), locale)}
                    </span>
                    <span style={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }}>
                      <Glyph cls={weatherCodeClass(d.code)} size={26} />
                    </span>
                    <span className="text-sm font-semibold whitespace-nowrap">
                      {fmtTempC(d.tempMaxC)} / {fmtTempC(d.tempMinC)}
                    </span>
                    <span className="text-[11px] flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                      <UmbrellaIcon /> {d.precipProb}%
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ------- Risk alert (top, red) ------- */}
            <div
              className="rounded-xl mt-6 p-5"
              style={
                advice.risk.length
                  ? {
                      background: 'rgba(220,38,38,0.07)',
                      border: '1px solid rgba(220,38,38,0.35)',
                    }
                  : { background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }
              }
            >
              <p
                className="flex items-center gap-2 font-semibold mb-2"
                style={{ color: advice.risk.length ? '#dc2626' : 'var(--text-primary)' }}
              >
                {advice.risk.length > 0 ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3 2.5 20h19Z" />
                    <path d="M12 10v4M12 17.5v.5" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {t('advice.alertTitle')}
              </p>
              {advice.risk.length > 0 ? (
                <ul className="space-y-1.5">
                  {advice.risk.map((k) => (
                    <li key={k} className="text-sm leading-relaxed flex gap-2" style={{ color: 'var(--text-secondary)' }}>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>•</span>
                      {t(`advice.risk.${k}`)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {t('advice.alertNone')}
                </p>
              )}
            </div>

            {/* ------- Three advice groups ------- */}
            <p className="font-display text-xl font-semibold mt-8 mb-4" style={{ color: 'var(--text-primary)' }}>
              {t('advice.title')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {catKeys.map((cat) => {
                const items = advice[cat];
                const meta = catLabels[cat];
                return (
                  <div
                    key={cat}
                    className="rounded-xl p-5"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
                  >
                    <p className="flex items-center gap-2 font-semibold mb-3" style={{ color: 'var(--accent)' }}>
                      <span aria-hidden="true">{meta.icon}</span>
                      {meta.title}
                    </p>
                    <ul className="space-y-2">
                      {items.map((k) => (
                        <li key={k} className="flex gap-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          <span
                            className="mt-[7px] h-1.5 w-1.5 rounded-full flex-shrink-0"
                            style={{ background: 'var(--accent)' }}
                          />
                          {t(`advice.${cat}.${k}`)}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* attribution */}
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span>
                {t('updated')}{' '}
                {new Date(data.fetchedAt).toLocaleString(locale, {
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZone: 'America/Los_Angeles',
                })}
              </span>
              <a
                href="https://open-meteo.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'underline' }}
              >
                {t('attribution')}
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* Metric chip used inside the summary card */
function Chip({
  icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  sub?: string;
  tone: 'water' | 'autumn';
}) {
  const color = tone === 'water' ? 'var(--color-water-600, var(--accent))' : 'var(--color-autumn-500, var(--accent))';
  return (
    <div
      className="rounded-xl px-4 py-3 flex items-center gap-3"
      style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
    >
      <span style={{ color }} aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          {label}
        </p>
        <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
          {value}
          {sub ? <span className="font-normal text-xs ml-1" style={{ color: 'var(--text-secondary)' }}>{sub}</span> : null}
        </p>
      </div>
    </div>
  );
}
