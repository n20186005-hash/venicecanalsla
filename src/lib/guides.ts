import type { Metadata } from 'next';
import { SITE } from './site';

export const GUIDE_KEYS = [
  'walking-map',
  'parking-directions',
  'visitor-guide',
  'photo-spots',
  'history',
] as const;

export type GuideKey = (typeof GUIDE_KEYS)[number];

/** Absolute canonical URLs for a guide in both locales. */
export function guideUrls(key: GuideKey): { zh: string; en: string } {
  const base = SITE.baseUrl;
  return {
    zh: `${base}/${key}`,
    en: `${base}/en/${key}`,
  };
}

/** Build the per-locale Metadata (title, description, canonical, hreflang). */
export function buildGuideMetadata(
  locale: string,
  key: GuideKey,
  metaTitle: string,
  metaDescription: string
): Metadata {
  const urls = guideUrls(key);
  const self = locale === 'zh' ? urls.zh : urls.en;

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: self,
      languages: {
        zh: urls.zh,
        en: urls.en,
        'x-default': urls.zh,
      },
    },
  };
}
