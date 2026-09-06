import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata, Viewport } from 'next';
import { SITE } from '@/lib/site';
import PwaRegister from '@/components/PwaRegister';
import CookieConsentBanner from '@/components/CookieConsentBanner';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2d6375' },
    { media: '(prefers-color-scheme: dark)', color: '#0c1a14' },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const baseUrl = SITE.baseUrl;

  const zhUrl = `${baseUrl}/`;
  const enUrl = `${baseUrl}/en`;
  const selfUrl = locale === 'zh' ? zhUrl : enUrl;

  const title = messages.meta.title as string;
  const description = messages.meta.description as string;
  const ogTitle = (messages.meta.ogTitle as string) || title;
  const ogDescription = (messages.meta.ogDescription as string) || description;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords: [
      SITE.fullName,
      SITE.shortName,
      'Venice Canals Los Angeles',
      'Venice Canal Historic District CA',
      `${SITE.city} canals`,
      `${SITE.city}, ${SITE.state}`,
      `${SITE.city} travel guide`,
    ],
    alternates: {
      canonical: selfUrl,
      languages: {
        'zh': zhUrl,
        'en': enUrl,
        'x-default': zhUrl,
      },
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: selfUrl,
      siteName: SITE.fullName,
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
      images: [
        {
          url: SITE.heroImageUrl,
          alt: (messages.meta.ogImageAlt as string) || `${SITE.fullName} in ${SITE.city}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [SITE.heroImageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
    applicationName: SITE.fullName,
    manifest: '/manifest.webmanifest',
    icons: {
      icon: [
        { url: '/icons/icon-192.png', type: 'image/png', sizes: '192x192' },
        { url: '/icons/icon-512.png', type: 'image/png', sizes: '512x512' },
      ],
      apple: [
        { url: '/icons/icon-192.png', type: 'image/png', sizes: '192x192' },
      ],
    },
    appleWebApp: {
      capable: true,
      title: SITE.shortName,
      statusBarStyle: 'default',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale === 'zh' ? 'zh-CN' : 'en'} suppressHydrationWarning>
      <head>
        {/* Google Analytics 4 - honours saved cookie preferences before the library loads */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${SITE.ga4Id}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              (function() {
                var consent = {
                  'ad_storage': 'denied',
                  'ad_user_data': 'denied',
                  'ad_personalization': 'denied',
                  'analytics_storage': 'denied'
                };
                try {
                  var prefs = JSON.parse(localStorage.getItem('cookiePrefs') || 'null');
                  if (prefs && prefs.analytics) {
                    consent.analytics_storage = 'granted';
                  }
                } catch(e) {}
                gtag('consent', 'default', consent);
                gtag('config', '${SITE.ga4Id}', { 'anonymize_ip': true });
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen">
        <NextIntlClientProvider messages={messages}>
          {children}
          <CookieConsentBanner />
        </NextIntlClientProvider>
        <PwaRegister />
      </body>
    </html>
  );
}
