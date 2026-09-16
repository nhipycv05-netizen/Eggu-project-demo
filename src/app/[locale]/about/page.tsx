import { AboutContent, DEFAULT_ABOUT_CONTENT } from '@/types/about';
import { createClient } from '@/lib/supabase/server';
import AboutClientView from '@/components/about/AboutClientView';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  let initialContent: AboutContent = { ...DEFAULT_ABOUT_CONTENT };

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'about_content')
      .single();

    if (data?.value) {
      initialContent = { ...DEFAULT_ABOUT_CONTENT, ...data.value };
    }
  } catch {
    // fallback to DEFAULT_ABOUT_CONTENT
  }

  return <AboutClientView initialContent={initialContent} locale={locale} />;
}
