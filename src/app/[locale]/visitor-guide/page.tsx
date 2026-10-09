import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import TopicGuide from '@/components/TopicGuide';
import { buildGuideMetadata } from '@/lib/guides';

const KEY = 'visitor-guide' as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: `guides.${KEY}` });
  return buildGuideMetadata(locale, KEY, t('metaTitle'), t('metaDescription'));
}

export default async function VisitorGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TopicGuide guideKey={KEY} locale={locale} />;
}
