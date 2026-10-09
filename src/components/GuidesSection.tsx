import { useTranslations } from 'next-intl';

const GUIDES = [
  'walking-map',
  'parking-directions',
  'visitor-guide',
  'photo-spots',
  'history',
] as const;

export default function GuidesSection({ locale }: { locale: string }) {
  const guideT = useTranslations('guides');

  return (
    <section className="section-padding" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          {guideT('navTitle')}
        </h2>
        <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GUIDES.map((key) => (
            <a
              key={key}
              href={`/${locale}/${key}`}
              className="rounded-xl p-5 transition-shadow hover:shadow-md"
              style={{
                background: 'var(--card-bg)',
                boxShadow: 'var(--card-shadow)',
                border: '1px solid var(--border-color)',
              }}
            >
              <span
                className="text-base font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                {guideT(`${key}.navLabel`)}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
