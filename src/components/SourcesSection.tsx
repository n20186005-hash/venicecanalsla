import { useTranslations } from 'next-intl';
import { SITE } from '@/lib/site';

const sources = [
  { key: 'nps', url: 'https://www.nps.gov/subjects/nationalregister/index.htm' },
  { key: 'ohp', url: 'https://ohp.parks.ca.gov/listedresources/' },
  { key: 'laParks', url: 'https://recreation.parks.lacity.gov/park/canal' },
  { key: 'laPlanning', url: 'https://planning.lacity.gov/protection-preservation/historic-preservation-overlay-zones' },
  { key: 'veniceNC', url: 'https://www.venicenc.org/' },
] as const;

export default function SourcesSection() {
  const t = useTranslations('sources');

  return (
    <section id="sources" className="section-padding" style={{ background: 'var(--bg-tertiary)' }}>
      <div className="max-w-4xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />

        <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
          {t('intro')}
        </p>

        {/* Official tourism portal (authoritative outbound link) */}
        <div
          className="rounded-xl p-5 sm:p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--accent)' }}
        >
          <div className="flex items-center gap-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" className="flex-shrink-0">
              <path d="M3 21h18" />
              <path d="M5 21V7l8-4v18" />
              <path d="M19 21V11l-6-4" />
              <path d="M9 9v.01" />
              <path d="M9 12v.01" />
            </svg>
            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
              {t('tourismLabel')}
            </p>
          </div>
          <a
            href={SITE.tourismUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white transition-colors whitespace-nowrap"
            style={{ background: 'var(--accent)' }}
          >
            {SITE.country} / {SITE.state}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>

        {/* Government / authoritative reference links */}
        <ul className="space-y-2">
          {sources.map((source) => (
            <li key={source.key}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm py-2 rounded-lg transition-colors"
                style={{ color: 'var(--accent)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                <span className="hover:underline">{t(source.key)}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
