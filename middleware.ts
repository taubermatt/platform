import { type NextRequest, NextResponse } from 'next/server';
import { rootDomain } from '@/lib/utils';
import { getDomainData } from '@/lib/domains';

function extractSubdomain(request: NextRequest): string | null {
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];
  const rootDomainFormatted = rootDomain.split(':')[0];

  // Handle preview deployment URLs (tenant---branch-name.vercel.app)
  if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
    const parts = hostname.split('---');
    return parts.length > 0 ? parts[0] : null;
  }

  // Regular subdomain detection
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, '') : null;
}

async function isCustomDomain(request: NextRequest): Promise<boolean> {
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];
  const rootDomainFormatted = rootDomain.split(':')[0];

  // Skip if it's the root domain or a subdomain
  if (hostname === rootDomainFormatted || 
      hostname === `www.${rootDomainFormatted}` ||
      hostname.endsWith(`.${rootDomainFormatted}`)) {
    return false;
  }

  // Check if this hostname exists in our domain database and is verified
  try {
    const domainData = await getDomainData(hostname);
    return !!(domainData && domainData.verified);
  } catch (error) {
    console.error('Error checking domain:', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);
  const isCustomDomainRequest = await isCustomDomain(request);

  // Handle subdomain routing (existing functionality)
  if (subdomain) {
    // Block access to management pages from subdomains
    if (pathname.startsWith('/subdomains') || pathname.startsWith('/domains')) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // For the root path on a subdomain, rewrite to the subdomain page
    if (pathname === '/') {
      return NextResponse.rewrite(new URL(`/s/${subdomain}`, request.url));
    }
  }

  // Handle custom domain routing (new functionality)
  if (isCustomDomainRequest) {
    const host = request.headers.get('host') || '';
    const hostname = host.split(':')[0];

    // Block access to management pages from custom domains
    if (pathname.startsWith('/subdomains') || pathname.startsWith('/domains')) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // For the root path on a custom domain, rewrite to the domain page
    if (pathname === '/') {
      return NextResponse.rewrite(new URL(`/d/${hostname}`, request.url));
    }
  }

  // On the root domain, allow normal access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|[\\w-]+\\.\\w+).*)'
  ]
};
