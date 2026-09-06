import { useTranslations, useMessages } from 'next-intl';

export default function FaqSection() {
  const t = useTranslations('faq');
  const messages = useMessages() as any;
  const items = (messages?.faq?.items || []) as Array<{ q: string; a: string }>;

  return (
    <section id="faq" className="section-padding">
      <div className="max-w-4xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <p className="mb-6" style={{ color: 'var(--text-muted)' }}>{t('intro')}</p>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        <div className="space-y-3">
          {items.map((item, i) => (
            <details
              key={i}
              className="rounded-xl overflow-hidden group"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
            >
              <summary
                className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 sm:px-6 py-4 select-none"
                style={{ color: 'var(--text-primary)' }}
              >
                <h3 className="font-semibold text-base sm:text-lg leading-snug">{item.q}</h3>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="flex-shrink-0 transition-transform group-open:rotate-180"
                  style={{ color: 'var(--accent)' }}
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div
                className="px-5 sm:px-6 pb-5 text-base leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
