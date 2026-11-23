import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { areas, nearbyMetadata, placeDetails, places } from '@/lib/nearby';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return nearbyMetadata(locale, '/nearby',
    locale === 'zh' ? '威尼斯运河周边景点' : 'Things to See Near the Venice Canals',
    locale === 'zh' ? '探索威尼斯海岸、玛丽安德尔湾和圣莫尼卡。' : 'Explore Venice, Marina del Rey, and Santa Monica from the historic canals.');
}

export default async function NearbyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const zh = locale === 'zh';
  return (
    <>
      <Header solid />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <h1 className="font-display text-4xl font-semibold mb-5">{zh ? '威尼斯运河周边景点' : 'Things to See Near the Venice Canals'}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{zh ? '从运河步行到威尼斯海岸，或把行程延伸至港湾和圣莫尼卡。' : 'Walk from the canals to the Venice waterfront or continue to the marina and Santa Monica.'}</p>
        {Object.entries(areas).map(([key, labels]) => (
          <section key={key} className="mt-12">
            <h2 className="font-display text-2xl font-semibold mb-5">{labels[zh ? 0 : 1]}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {places.filter(place => place.area === key).map(place => {
                const details = placeDetails(place, locale);
                return (
                  <a key={place.slug} href={`/${locale}/nearby/${place.slug}`}
                    className="rounded-xl border overflow-hidden block hover:shadow-md"
                    style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                    {place.photo && <img src={place.photo} alt={details.name} loading="lazy" className="w-full h-44 object-cover" />}
                    <div className="p-5">
                      <h3 className="font-display text-lg font-semibold">{details.name}</h3>
                      <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>{place.address}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
}
