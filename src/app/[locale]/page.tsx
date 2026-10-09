import { setRequestLocale } from 'next-intl/server';
import { SITE, localeUrl } from '@/lib/site';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SemanticIntro from '@/components/SemanticIntro';
import Intro from '@/components/Intro';
import BasicInfo from '@/components/BasicInfo';
import WeatherSection from '@/components/WeatherSection';
import HoursSection from '@/components/HoursSection';
import TicketsSection from '@/components/TicketsSection';
import TransportSection from '@/components/TransportSection';
import InfoSection from '@/components/InfoSection';
import RouteSection from '@/components/RouteSection';
import AmenitiesSection from '@/components/AmenitiesSection';
import Gallery from '@/components/Gallery';
import Reviews from '@/components/Reviews';
import LandmarksSection from '@/components/LandmarksSection';
import MapEmbed from '@/components/MapEmbed';
import GuidesSection from '@/components/GuidesSection';
import FaqSection from '@/components/FaqSection';
import SourcesSection from '@/components/SourcesSection';
import Footer from '@/components/Footer';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const messages = (await import(`@/messages/${locale}.json`)).default as any;
  const faqItems: Array<{ q: string; a: string }> = messages?.faq?.items || [];
  const selfUrl = localeUrl(locale);

  // 1. TouristAttraction entity JSON-LD (geo + physical attributes)
  const touristAttractionSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    '@id': `${SITE.baseUrl}/#attraction`,
    name: SITE.fullName,
    alternateName: [
      SITE.shortName,
      `${SITE.fullName}, ${SITE.city}, ${SITE.state}`,
      `${SITE.shortName} Los Angeles`,
    ],
    description: `Comprehensive visitor guide to ${SITE.fullName} in ${SITE.city}, ${SITE.state}, ${SITE.country}.`,
    url: selfUrl,
    image: [SITE.heroImageUrl],
    isAccessibleForFree: true,
    publicAccess: true,
    openingHours: 'Mo-Su 00:00-24:00',
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.fullName,
      addressLocality: SITE.city,
      addressRegion: SITE.state,
      postalCode: SITE.postalCode,
      addressCountry: SITE.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.latitude,
      longitude: SITE.longitude,
    },
    hasMap: SITE.mapsShareUrl,
    sameAs: [SITE.mapsShareUrl, SITE.tourismUrl],
  };

  // FAQPage JSON-LD - mirrors the visible FAQ content for the current locale.
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  // BreadcrumbList JSON-LD (visible single-page guide, so Home links to itself).
  const homeName = locale === 'zh' ? '首页' : 'Home';
  const attractionName = locale === 'zh' ? '威尼斯运河历史区' : SITE.fullName;
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeName, item: selfUrl },
      { '@type': 'ListItem', position: 2, name: attractionName, item: selfUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(touristAttractionSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Header />
      <main>
        <Hero />
        <SemanticIntro />
        <Intro />
        <BasicInfo />
        <WeatherSection />
        <HoursSection />
        <TicketsSection />
        <TransportSection />
        <InfoSection />
        <RouteSection />
        <AmenitiesSection />
        <Gallery />
        <Reviews />
        <LandmarksSection />
        <MapEmbed />
        <GuidesSection locale={locale} />
        <FaqSection />
        <SourcesSection />
      </main>
      <Footer />
    </>
  );
}
