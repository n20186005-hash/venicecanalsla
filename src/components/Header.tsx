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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href={logoHref} className="font-display text-sm sm:text-lg font-semibold tracking-tight truncate mr-2" style={{ color: filled ? 'var(--text-primary)' : '#fff' }}>
          Venice Canal Historic District
        </a>

        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          {(['gallery', 'reviews', 'map', 'nearby'] as const).map((section) => (
            <a
              key={section}
              href={section === 'nearby' ? base + '/nearby' : base + '/#' + section}
              className="text-sm font-medium transition-colors"
              style={{ color: filled ? 'var(--text-secondary)' : 'rgba(255,255,255,0.85)' }}
            >
              {t(section)}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a href={base + '/nearby'} className="md:hidden text-xs font-medium"
            style={{ color: filled ? 'var(--text-secondary)' : '#fff' }}>
            {t('nearbyMobile')}
          </a>
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
