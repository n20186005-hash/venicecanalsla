import { useTranslations, useMessages, useLocale } from 'next-intl';

export default function LandmarksSection() {
  const t = useTranslations('landmarks');
  const label = useTranslations('header');
  const locale = useLocale();
  const links = ['venice-boardwalk', 'abbot-kinney-boulevard', 'muscle-beach-venice', '', 'santa-monica-pier', 'venice-sign'];
  const messages = useMessages() as any;
  const items = (messages?.landmarks?.items || []) as Array<{ name: string; desc: string }>;

  return (
    <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />

        {/* Semantic cluster description */}
        <p className="text-lg leading-relaxed mb-10" style={{ color: 'var(--text-secondary)' }}>
          {t('description')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="rounded-xl p-5 flex flex-col gap-3"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: 'var(--accent)', color: 'white' }}
                >
                  {index + 1}
                </div>
                <h3 className="font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>
                  <a href={`/${locale}/nearby${links[index] ? '/' + links[index] : ''}`} className="hover:underline">{item.name}</a>
                </h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
        <a href={`/${locale}/nearby`} className="inline-block mt-6 font-medium underline" style={{ color: 'var(--accent)' }}>
          {label('nearby')}
        </a>
      </div>
    </section>
  );
}
