import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { Open_Sans, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import '../globals.css';

const GA_MEASUREMENT_ID = 'G-653W80C2L8';

const openSans = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartToast from '@/components/ui/CartToast';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { createClient } from '@/lib/supabase/server';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate that the incoming locale is supported
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Retrieve all messages for the locale
  const messages = await getMessages();

  // Fetch primary store info for footer
  let store = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('stores')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (data) {
      store = data;
    }
  } catch (error) {
    console.error('Failed to fetch store in layout:', error);
  }

  return (
    <html lang={locale} className={`${openSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col text-foreground font-sans">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer store={store} locale={locale} />
          <CartToast />
          <ScrollToTop />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
