import { useTranslations, useLocale, useMessages } from 'next-intl';
import { SITE, localeUrl } from '@/lib/site';
import { GuideKey, guideUrls } from '@/lib/guides';

export default function TopicGuide({
  guideKey,
  locale,
}: {
  guideKey: GuideKey;
  locale: string;
}) {
  const t = useTranslations(`guides.${guideKey}`);
  const ht = useTranslations('header');
  const navT = useTranslations('guides');
  const messages = useMessages() as any;
  const guide = messages?.guides?.[guideKey] || {};
  const sections = (guide.sections || []) as Array<{ id: string; title: string; content: string }>;
  const faq = (guide.faq || []) as Array<{ q: string; a: string }>;

  const urls = guideUrls(guideKey);
  const self = locale === 'zh' ? urls.zh : urls.en;
  const homeHref = `/${locale}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: locale === 'zh' ? '首页' : 'Home',
        item: localeUrl(locale),
      },
      { '@type': 'ListItem', position: 2, name: t('h1'), item: self },
    ],
  };

  const faqSchema = faq.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      }
    : null;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Structured data */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <a
          href={homeHref}
          className="inline-flex items-center gap-2 text-sm font-medium mb-6 transition-colors"
          style={{ color: 'var(--accent)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {ht('backToHome')}
        </a>

        <h1
          className="font-display text-3xl sm:text-4xl font-bold mb-4 leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('h1')}
        </h1>
        <div className="w-12 h-0.5 mb-6" style={{ background: 'var(--accent)' }} />

        <p
          className="text-base leading-relaxed mb-10 max-w-2xl"
          style={{ color: 'var(--text-secondary)' }}
        >
          {t('intro')}
        </p>

        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.id} id={section.id}>
              <h2
                className="font-display text-xl sm:text-2xl font-semibold mb-3"
                style={{ color: 'var(--text-primary)' }}
              >
                {section.title}
              </h2>
              <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {section.content}
              </p>
            </section>
          ))}

          {faq.length > 0 && (
            <section>
              <h2
                className="font-display text-xl sm:text-2xl font-semibold mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                {locale === 'zh' ? '常见问题' : 'Frequently Asked Questions'}
              </h2>
              <div className="space-y-4">
                {faq.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-5"
                    style={{
                      background: 'var(--card-bg)',
                      boxShadow: 'var(--card-shadow)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <h3
                      className="font-semibold mb-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {item.q}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Related guides (internal links) */}
        <div className="mt-14 pt-8" style={{ borderTop: '1px solid var(--border-color)' }}>
          <h2
            className="font-display text-lg font-semibold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            {navT('navTitle')}
          </h2>
          <div className="flex flex-wrap gap-3">
            {(['walking-map', 'parking-directions', 'visitor-guide', 'photo-spots', 'history'] as const)
              .filter((k) => k !== guideKey)
              .map((k) => (
                <a
                  key={k}
                  href={`/${locale}/${k}`}
                  className="text-sm font-medium px-4 py-2 rounded-full transition-colors"
                  style={{
                    color: 'var(--accent)',
                    border: '1px solid var(--accent)',
                  }}
                >
                  {navT(`${k}.navLabel`)}
                </a>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
