'use client';

import { useTranslations, useLocale } from 'next-intl';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import { useState, useEffect } from 'react';

export default function Header({ solid = false }: { solid?: boolean }) {
  const t = useTranslations('header');
  const [scrolled, setScrolled] = useState(false);
  const filled = solid || scrolled;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const locale = useLocale();
  // localePrefix: 'always' -> both zh and en carry their locale prefix.
  const base = `/${locale}`;
  const logoHref = base;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: filled ? 'var(--bg-secondary)' : 'transparent',
        borderBottom: filled ? '1px solid var(--border-color)' : 'none',
        backdropFilter: filled ? 'blur(12px)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-[minmax(0,1fr)_auto] items-center md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <a href={logoHref} className="flex items-center h-14 md:h-16 font-display text-sm lg:text-lg font-semibold tracking-tight min-w-0 pr-2"
          style={{ color: filled ? 'var(--text-primary)' : '#fff' }}>
          <span className="truncate">{t('brand')}</span>
        </a>

        <nav aria-label={t('navigation')}
          className="col-span-2 row-start-2 flex min-h-11 items-center justify-center gap-x-5 sm:gap-x-7 md:col-span-1 md:row-start-1 md:col-start-2 md:h-16 md:gap-x-4 lg:gap-x-6"
          style={{ color: filled ? 'var(--text-primary)' : '#fff' }}>
          {(['gallery', 'reviews', 'map', 'nearby'] as const).map((section) => (
            <a
              key={section}
              href={section === 'nearby' ? base + '/nearby' : base + '#' + section}
              className="inline-flex min-h-11 items-center whitespace-nowrap text-xs sm:text-sm font-medium hover:underline underline-offset-4"
            >
              {t(section)}
            </a>
          ))}
        </nav>

        <div className="row-start-1 col-start-2 md:col-start-3 justify-self-end flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
