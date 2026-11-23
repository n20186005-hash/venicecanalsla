import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { nearbyMetadata, placeDetails, places } from '@/lib/nearby';

type Props = { params: Promise<{ locale: string; slug: string }> };

const lodging = {
  v: [
    '想早一点走运河和海滨，可比较威尼斯海滩或主街一带的住宿。经常搭地铁出行时，也可比较圣莫尼卡市中心到景点的周末交通。',
    'For an early canal and beach walk, compare stays near Venice Beach or Main Street. If you plan to use rail often, also compare weekend travel from Downtown Santa Monica.',
  ],
  m: [
    '行程以港湾为主，可优先比较 Admiralty Way 或 Via Marina 一带的住宿，并在订房前看酒店与目的地是否在同一岸。若要早班机，再比较机场附近住宿与海边停留之间的取舍。',
    'For a marina-focused visit, look near Admiralty Way or Via Marina and check which side of the harbor your hotel is on. Compare an airport-area stay if you have an early departure.',
  ],
  s: [
    '想步行串联码头与市中心地铁站，可比较 Downtown Santa Monica 的住宿。以社区公园和南段海滩为主时，也可查看 Main Street 与 Ocean Park 一带。',
    'For the pier and the downtown rail station on foot, compare stays in Downtown Santa Monica. Main Street and Ocean Park are alternatives for neighborhood parks and the southern waterfront.',
  ],
} as const;

function GuideSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-32 md:scroll-mt-24">
      <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-4">{title}</h2>
      <div className="w-10 h-0.5 mb-4" style={{ background: 'var(--accent)' }} />
      {children}
    </section>
  );
}

export function generateStaticParams() {
  return places.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const place = places.find(item => item.slug === slug);
  if (!place) notFound();
  const { name, description } = placeDetails(place, locale);
  return nearbyMetadata(locale, '/nearby/' + slug, name, description, place.photo);
}

export default async function AttractionPage({ params }: Props) {
  const { locale, slug } = await params;
  const place = places.find(item => item.slug === slug);
  if (!place) notFound();
  setRequestLocale(locale);
  const zh = locale === 'zh';
  const details = placeDetails(place, locale);
  const guide = place.guide[zh ? 'zh' : 'en'];
  const nearby = `/${locale}/nearby`;
  const field: [string, ReactNode][] = [
    [zh ? '景点英文名' : 'Attraction name', place.en],
    [zh ? '景点类型' : 'Attraction type', guide.kind],
    [zh ? '所在地区' : 'Area', details.area],
    [zh ? '地址或到访入口' : 'Address or approach', place.address],
    [zh ? '管理主体' : 'Management', details.operator],
    [zh ? '建议停留' : 'Suggested visit length', zh ? `约 ${place.visitMinutes} 分钟` : `About ${place.visitMinutes} minutes`],
    [zh ? '开放时间' : 'Opening hours', <a href="#hours">{details.hours}</a>],
    [zh ? '门票或收费' : 'Admission and fees', <a href="#admission">{details.admission}</a>],
  ];
  const related = places.filter(item => item.area === place.area && item.slug !== slug);
  const modes = [
    ['walking', zh ? '步行路线' : 'Walking'],
    ['transit', zh ? '公共交通路线' : 'Public transit'],
    ['driving', zh ? '自驾路线' : 'Driving'],
  ] as const;
  const accent = { color: 'var(--accent)' };
  const card = { background: 'var(--card-bg)', borderColor: 'var(--border-color)' };
  const copy = 'max-w-3xl leading-relaxed';
  const mapLabel = zh ? '在 Google 地图查看' : 'View on Google Maps';

  return (
    <>
      <Header solid />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-32 md:pt-24 pb-16">
        <header>
          <div className="relative isolate overflow-hidden rounded-2xl min-h-[27rem] flex items-end text-white" style={{ background: 'var(--color-nature-900)' }}>
            {place.photo && (
              <img src={place.photo} alt={details.name} fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover" />
            )}
            <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/90 via-black/60 to-black/25" aria-hidden="true" />
            <div className="p-5 sm:p-9 lg:p-12 w-full">
              <a href={nearby} className="text-sm font-medium underline underline-offset-4 text-white">
                {zh ? '周边景点' : 'Nearby attractions'} / {details.area}
              </a>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mt-4 mb-3 leading-tight">{details.name}</h1>
              <p className="text-lg sm:text-xl mb-3 max-w-2xl text-white/90">{guide.tagline}</p>
              <p className="text-sm mb-4 text-white/85">{place.address}</p>
              <ul className="flex flex-wrap gap-2 mb-5 text-sm">
                <li><a href="#reviews" className="inline-block rounded-full bg-black/45 px-3 py-2 underline">{zh ? 'Google 评分与游客评价' : 'Google ratings and reviews'}</a></li>
                <li><a href="#hours" className="inline-block rounded-full bg-black/45 px-3 py-2 underline">{details.hours}</a></li>
              </ul>
              <a href={details.map} className="inline-block rounded-full px-5 py-2 text-sm font-semibold text-white bg-water-700 hover:bg-water-800">
                {mapLabel}
              </a>
            </div>
          </div>
          {place.photo && (
            <p className="text-sm mt-2 text-right" style={{ color: 'var(--text-secondary)' }}>
              <a href={place.photoSource} className="underline">{zh ? '照片来源' : 'Photo source'}</a>
            </p>
          )}
        </header>

        <div className="mt-9 space-y-10 sm:space-y-12">
          <GuideSection id="explore" title={zh ? '探索' + details.name : 'Explore ' + details.name}>
            <p className={copy}>{details.description}</p>
          </GuideSection>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border p-5" style={card}>
              <GuideSection id="visit-tips" title={zh ? '游览建议' : 'Visit tips'}>
                <p className={copy}>{guide.visitTip}</p>
              </GuideSection>
            </div>
            <div className="rounded-xl border p-5" style={card}>
              <GuideSection id="highlights" title={zh ? '景点特色' : 'Highlights'}>
                <p className={copy}>{guide.feature}</p>
              </GuideSection>
            </div>
          </div>

          <div className="rounded-2xl border px-5 py-6 sm:px-8" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <GuideSection id="about-place" title={zh ? '关于' + details.name : 'About ' + details.name}>
              <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{guide.kind} · {details.area}</p>
              <p className={copy}><strong>{zh ? '管理主体' : 'Management'}</strong> · {details.operator}</p>
              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm" style={accent}>
                <a href={place.source} className="underline">{zh ? '查看景点资料' : 'Visitor information source'}</a>
                {place.contextSource && (
                  <a href={place.contextSource} className="underline">{zh ? '管理或历史资料' : 'Management or historical source'}</a>
                )}
              </div>
            </GuideSection>
          </div>

          <GuideSection id="visitor-information" title={zh ? '基础信息表' : 'Visitor information'}>
            <div className="rounded-xl border overflow-hidden" style={card}>
              <table className="w-full text-left text-sm sm:text-base">
                <caption className="sr-only">{details.name}</caption>
                <tbody>
                  {field.map(([label, value], index) => (
                    <tr key={label} className={index ? 'border-t' : ''} style={{ borderColor: 'var(--border-color)' }}>
                      <th scope="row" className="w-[32%] sm:w-48 px-4 py-3 align-top font-semibold">{label}</th>
                      <td className="px-4 py-3 break-words [&_a]:underline" style={{ color: 'var(--text-secondary)' }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <a href={place.source} className="underline inline-block mt-4" style={accent}>{zh ? '查阅到访资料' : 'Check visitor information'}</a>
          </GuideSection>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border p-5" style={card}>
              <GuideSection id="hours" title={zh ? '开放时间' : 'Opening hours'}>
                <p className={copy}>{details.hours}</p>
                <a href={details.hoursSource} className="underline inline-block mt-3" style={accent}>{zh ? '查看开放公告或时刻表' : 'Check the opening notice or calendar'}</a>
              </GuideSection>
            </div>
            <div className="rounded-xl border p-5" style={card}>
              <GuideSection id="admission" title={zh ? '门票价格' : 'Admission and prices'}>
                <p className={copy}>{details.admission}</p>
                <a href={details.admissionSource} className="underline inline-block mt-3" style={accent}>{zh ? '查看收费或预约规则' : 'Check prices or booking rules'}</a>
              </GuideSection>
            </div>
          </div>

          <div className="rounded-xl border p-5 sm:p-7" style={card}>
            <GuideSection id="transport" title={zh ? '交通方式' : 'Getting here from the Venice Canals'}>
              <p className={copy}>{details.transport}</p>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 mt-3">
                {modes.map(([mode, label]) => (
                  <li key={mode}><a href={details.directions + '&travelmode=' + mode} className="underline" style={accent}>{label}</a></li>
                ))}
              </ul>
            </GuideSection>
          </div>

          <GuideSection id="discover" title={zh ? '发现魅力' : 'History, design and local character'}>
            <p className={copy}>{guide.background}</p>
          </GuideSection>

          <div className="rounded-xl border p-5 sm:p-7" style={card}>
            <GuideSection id="walk" title={zh ? '现场步行路线' : 'Suggested walk'}>
              <ol className="list-decimal space-y-2 pl-6" style={{ color: 'var(--text-secondary)' }}>
                {guide.walk.map(step => <li key={step}>{step}</li>)}
              </ol>
            </GuideSection>
          </div>

          <GuideSection id="visitor-notes" title={zh ? '游览须知' : 'Before you go'}>
            <p className={copy}>{guide.notice}</p>
            <details className="rounded-xl border px-5 py-4 mt-4" style={card}>
              <summary className="font-semibold cursor-pointer">{guide.question}</summary>
              <p className="mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{guide.answer}</p>
            </details>
          </GuideSection>

          <div className="rounded-xl border p-5 sm:p-7" style={card}>
            <GuideSection id="photos" title={zh ? '拍照机位' : 'Photography spots'}>
              <p className={copy}>{guide.photoTip}</p>
            </GuideSection>
          </div>

          <div className="rounded-xl border p-5 sm:p-7" style={card}>
            <GuideSection id="lodging" title={zh ? '住宿建议' : 'Where to stay'}>
              <p className={copy}>{lodging[place.area as keyof typeof lodging][zh ? 0 : 1]}</p>
            </GuideSection>
          </div>

          <GuideSection id="reviews" title={zh ? '游客评价' : 'Visitor reviews'}>
            <a href={details.map} className="underline" style={accent}>{zh ? '查看 Google 地图上的评分及游客评价' : 'Find ratings and visitor reviews on Google Maps'}</a>
          </GuideSection>

          <div className="rounded-xl border p-5 sm:p-7" style={card}>
            <GuideSection id="location" title={zh ? '交通指南与地图' : 'Address and map'}>
              <p className={copy}>{place.address}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3">
                <a href={details.map} className="underline" style={accent}>{mapLabel}</a>
                <a href={details.directions} className="underline" style={accent}>{zh ? '从威尼斯运河规划路线' : 'Get directions from the Venice Canals'}</a>
              </div>
            </GuideSection>
          </div>

          <GuideSection id="nearby-guides" title={zh ? '更多周边专页' : 'More nearby attraction guides'}>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {related.map(item => <li key={item.slug}><a className="underline" style={accent} href={`${nearby}/${item.slug}`}>{zh ? item.zh : item.en}</a></li>)}
            </ul>
            <a href={nearby} className="underline inline-block mt-4 font-medium" style={accent}>
              {zh ? `浏览全部 ${places.length} 个周边景点` : `Browse all ${places.length} nearby attractions`}
            </a>
          </GuideSection>
        </div>
      </main>
      <Footer />
    </>
  );
}
