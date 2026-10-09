import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.baseUrl;
  const paths = [
    '',
    '/walking-map',
    '/parking-directions',
    '/visitor-guide',
    '/photo-spots',
    '/history',
  ];

  const entries: MetadataRoute.Sitemap = [];
  for (const path of paths) {
    const zhUrl = `${base}${path}`;
    const enUrl = `${base}/en${path}`;
    entries.push({
      url: zhUrl,
      lastModified: new Date(),
      alternates: {
        languages: {
          zh: zhUrl,
          en: enUrl,
        },
      },
    });
    entries.push({
      url: enUrl,
      lastModified: new Date(),
      alternates: {
        languages: {
          zh: zhUrl,
          en: enUrl,
        },
      },
    });
  }

  return entries;
}
