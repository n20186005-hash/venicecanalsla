import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['zh', 'en'],
  defaultLocale: 'zh',
  localePrefix: {
    mode: 'always',
  },
  pathnames: {
    '/': '/',
    '/privacy-policy': '/privacy-policy',
    '/terms-of-service': '/terms-of-service',
    '/cookie-settings': '/cookie-settings',
    '/walking-map': '/walking-map',
    '/parking-directions': '/parking-directions',
    '/visitor-guide': '/visitor-guide',
    '/photo-spots': '/photo-spots',
    '/history': '/history',
  },
});

export type Locale = (typeof routing.locales)[number];
