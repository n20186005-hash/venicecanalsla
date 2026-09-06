import { useTranslations, useMessages, useLocale } from 'next-intl';
import { homeRoute } from '@/lib/site';

export default function SemanticIntro() {
  const t = useTranslations('semanticIntro');
  const locale = useLocale();
  const messages = useMessages() as any;
  const crumbs: string[] = messages?.semanticIntro?.crumbs || [];

  return (
    <section className="px-4 sm:px-6 pt-10 sm:pt-14 pb-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Geo hierarchy breadcrumb: FullName -> City -> State -> Country */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-y-2 text-sm">
            {crumbs.map((crumb, i) => (
              <li key={i} className="flex items-center">
                {i > 0 && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="mx-2"
                    style={{ color: 'var(--text-muted)' }}
                    aria-hidden="true"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                )}
                {i === 0 ? (
                  <a
                    href={homeRoute(locale)}
                    className="font-medium transition-colors"
                    style={{ color: 'var(--accent)' }}
                  >
                    {crumb}
                  </a>
                ) : (
                  <span
                    className={i === crumbs.length - 1 ? 'font-semibold' : ''}
                    style={{ color: i === crumbs.length - 1 ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                  >
                    {crumb}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Entity equivalence statement (first-paragraph semantic binding) */}
        <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {t('welcome')}
        </p>
      </div>
    </section>
  );
}
