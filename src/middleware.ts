import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

const APEX_HOST = 'venicecanalsla.com';
const WWW_HOST = 'www.venicecanalsla.com';

export default function middleware(request: NextRequest) {
  const { hostname, protocol } = request.nextUrl;

  // Normalise the production apex domain to the www host and force https.
  // Localhost / dev hosts are left untouched so local development keeps working.
  if (hostname === APEX_HOST || protocol === 'http:') {
    const targetHost = hostname === APEX_HOST ? WWW_HOST : hostname;
    const url = request.nextUrl.clone();
    url.hostname = targetHost;
    url.protocol = 'https:';
    url.port = '';
    return NextResponse.redirect(url, 308);
  }

  return intlMiddleware(request);
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
