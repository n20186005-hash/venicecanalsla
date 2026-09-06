/**
 * Single-source-of-truth config for the Venice Canal Historic District
 * visitor-guide site (https://venicecanalsla.com).
 *
 * Every SEO-relevant value (entity name, coordinates, map links, nearby
 * landmarks, analytics id, etc.) used across the layout / JSON-LD / page
 * components is defined here, so the site stays consistent.
 */

export const SITE = {
  // Domain & URLs
  domain: 'venicecanalsla.com',
  baseUrl: 'https://venicecanalsla.com',

  // Entity naming (see SEO binding config)
  fullName: 'Venice Canal Historic District',
  shortName: 'Venice Canals',

  // Administrative hierarchy
  city: 'Venice',
  state: 'California',
  country: 'United States',
  countryCode: 'US',
  postalCode: '90292',

  // Geography
  latitude: 33.9833582,
  longitude: -118.4723585,
  plusCode: 'XGMJ+8X',

  // Google Maps
  mapsShareUrl: 'https://maps.app.goo.gl/s68GPQtw1QcQEJRM6',
  mapsEmbedSrc:
    'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5660.392365579113!2d-118.4723585!3d33.9833582!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2baa2bf5a7289%3A0x96e7291be897f918!2sVenice%20Canal%20Historic%20District!5e1!3m2!1sen!2s!4v1788711936681!5m2!1sen!2s',

  // Nearby landmarks (semantic cluster)
  landmark1: 'Venice Beach Boardwalk',
  landmark2: 'Abbot Kinney Boulevard',

  // Official / authoritative tourism portal
  tourismUrl: 'https://www.visitcalifornia.com',

  // Google rating facts (latest from Google Maps listing)
  rating: '4.6',
  reviewCount: '13,030',

  // GA4 Measurement ID
  ga4Id: 'G-HXM22WWPKP',

  // Images (served from /public)
  heroImagePath: '/images/hero.jpg',
  heroImageUrl: 'https://venicecanalsla.com/images/hero.jpg',
} as const;

/** Absolute canonical / self URL for a given locale. */
export function localeUrl(locale: string, suffix = ''): string {
  // zh is the default locale and lives at the bare root path.
  const prefix = locale === 'en' ? '/en' : '';
  return `${SITE.baseUrl}${prefix}${suffix}`;
}

/** Home route used for in-page navigation links. */
export function homeRoute(locale: string): string {
  // localePrefix: 'always' -> both zh & en carry their prefix.
  return `/${locale}`;
}
