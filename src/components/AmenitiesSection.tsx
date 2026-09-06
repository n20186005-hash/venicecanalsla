import { useTranslations, useMessages } from 'next-intl';

export default function AmenitiesSection() {
  const t = useTranslations('amenities');
  const messages = useMessages() as any;
  const items = (messages?.amenities?.items || []) as Array<{
    title: string;
    desc: string;
    tip: string;
  }>;

  return (
    <section id="amenities" className="section-padding" style={{ background: 'var(--bg-tertiary)' }}>
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <p className="text-base leading-relaxed mb-8 max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
          {t('subtitle')}
        </p>
        <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {items.map((item, index) => (
            <div
              key={index}
              className="rounded-xl p-6 flex flex-col gap-3"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: 'var(--accent)', color: 'white' }}
                >
                  {index + 1}
                </div>
                <h3 className="font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {item.desc}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {t('tipPrefix')} {item.tip}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
