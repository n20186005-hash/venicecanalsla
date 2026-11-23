import { places } from '@/lib/nearby';

const featured = [
  'venice-fishing-pier',
  'venice-skatepark',
  'burton-chace-park',
  'marina-wetland-park',
  'tongva-park',
  'annenberg-beach-house',
];

export default function NearbyExplore({ locale }: { locale: string }) {
  const zh = locale === 'zh';
  return (
    <section id="nearby" className="section-padding scroll-mt-16" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-5">
          {zh ? '从威尼斯运河继续游览' : 'Explore beyond the Venice Canals'}
        </h2>
        <div className="w-12 h-0.5 mb-6" style={{ background: 'var(--accent)' }} />
        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
          {zh ? '从运河走去海滨，或把行程延伸到玛丽安德尔湾与圣莫尼卡。' : 'Walk from the canals to the beach, or continue to Marina del Rey and Santa Monica.'}
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map(slug => {
            const place = places.find(item => item.slug === slug);
            if (!place) return null;
            const name = zh ? place.zh : place.en;
            return (
              <a key={slug} href={`/${locale}/nearby/${slug}`}
                className="rounded-xl overflow-hidden border block hover:shadow-md"
                style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                <img src={place.photo} alt="" loading="lazy" className="w-full h-40 object-cover" />
                <h3 className="font-display text-lg font-semibold p-4">{name}</h3>
              </a>
            );
          })}
        </div>
        <a href={`/${locale}/nearby`} className="inline-block mt-6 underline font-medium" style={{ color: 'var(--accent)' }}>
          {zh ? `查看全部 ${places.length} 个周边景点` : `Browse all ${places.length} nearby attractions`}
        </a>
      </div>
    </section>
  );
}
