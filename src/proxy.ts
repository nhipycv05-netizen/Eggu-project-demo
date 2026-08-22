import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Create an initial response object to track cookie modifications
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Initialize Supabase server client for middleware session refresh
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Retrieve user (this automatically refreshes session cookies if expired)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If path starts with /admin, handle backoffice routing and auth check
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    // Redirect unauthenticated admin access to login page
    if (!user && pathname !== '/admin/login') {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect logged-in admin away from login page to dashboard
    if (user && pathname === '/admin/login') {
      const dashboardUrl = new URL('/admin/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }

    return response;
  }

  // Handle localization for all public paths
  const i18nResponse = handleI18nRouting(request);

  // Copy any refreshed session cookies from our Supabase response to the i18n response
  response.cookies.getAll().forEach((cookie) => {
    i18nResponse.cookies.set(cookie.name, cookie.value, {
      path: cookie.path,
      domain: cookie.domain,
      maxAge: cookie.maxAge,
      secure: cookie.secure,
      sameSite: cookie.sameSite,
      httpOnly: cookie.httpOnly,
      expires: cookie.expires,
    });
  });

  return i18nResponse;
}

export const config = {
  // Matcher for paths to process. Exclude static assets, API routes, etc.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
