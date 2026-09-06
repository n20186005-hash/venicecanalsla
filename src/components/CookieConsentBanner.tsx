'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useState } from 'react';

export default function CookieConsentBanner() {
  const t = useTranslations('cookieBanner');
  const locale = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const hasChoice = localStorage.getItem('cookiePrefs') !== null;
      if (!hasChoice) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function apply(analytics: boolean) {
    try {
      localStorage.setItem('cookiePrefs', JSON.stringify({ analytics, marketing: false }));
    } catch {
      /* storage unavailable - proceed without persisting */
    }
    try {
      const w = window as any;
      if (typeof w.gtag === 'function') {
        w.gtag('consent', 'update', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          analytics_storage: analytics ? 'granted' : 'denied',
        });
      }
    } catch {
      /* gtag not loaded yet - preference is still saved for the next page view */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xl z-[999] rounded-2xl p-5 sm:p-6 shadow-lg"
      style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
    >
      <div className="flex items-start gap-3 mb-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" className="flex-shrink-0 mt-0.5">
          <circle cx="12" cy="12" r="10" />
          <circle cx="8" cy="10" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="12" cy="7" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="15.5" cy="12.5" r="1.2" fill="currentColor" stroke="none" />
          <path d="M9 16.5a3.2 3.2 0 0 0 5-1" />
        </svg>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {t('text')}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => apply(true)}
          className="px-4 py-2 rounded-full text-sm font-medium text-white transition-colors"
          style={{ background: 'var(--accent)' }}
        >
          {t('accept')}
        </button>
        <button
          onClick={() => apply(false)}
          className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
          style={{
            background: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
          }}
        >
          {t('essentialOnly')}
        </button>
        <a
          href={`/${locale}/cookie-settings`}
          className="px-2 py-2 text-sm font-medium hover:underline"
          style={{ color: 'var(--accent)' }}
        >
          {t('settings')}
        </a>
      </div>
    </div>
  );
}
