import type { Metadata } from 'next';
import { AboutContent, DEFAULT_ABOUT_CONTENT } from '@/types/about';
import { createClient } from '@/lib/supabase/server';
import AboutClientView from '@/components/about/AboutClientView';
import { getCanonicalUrl, getAlternateLanguages } from '@/lib/seo';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isVi = locale === 'vi';
  const canonicalUrl = getCanonicalUrl('/about', locale);
  const alternates = getAlternateLanguages('/about');

  return {
    title: isVi
      ? 'Về Chúng Tôi | EGGU - Sandwich Trứng Hàn Quốc'
      : 'About Us | EGGU - Korean Egg Sandwich Hanoi',
    description: isVi
      ? 'Tìm hiểu câu chuyện thương hiệu EGGU - Thương hiệu bánh mì sandwich trứng Hàn Quốc chuẩn vị tại Hà Nội với nguyên liệu tươi sạch và tình yêu ẩm thực.'
      : 'Learn about EGGU story - Authentic Korean egg sandwich in Hanoi created with fresh ingredients and passion.',
    keywords: [
      'Giới thiệu EGGU',
      'Về chúng tôi EGGU',
      'Sandwich Trứng Hàn Quốc',
      'Korean Egg Sandwich',
      'Bánh mì sandwich Hà Nội',
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: alternates,
    },
    openGraph: {
      title: isVi ? 'Về Chúng Tôi | EGGU' : 'About Us | EGGU',
      description: isVi
        ? 'Câu chuyện thương hiệu EGGU - Sandwich Trứng Hàn Quốc tại Hà Nội.'
        : 'The story behind EGGU Korean Egg Sandwich Hanoi.',
      url: canonicalUrl,
      siteName: 'EGGU',
    },
  };
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
