import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SITE_URL } from '@/lib/seo';
import { MOCK_PRODUCTS } from '@/lib/mockProducts';
import { MOCK_NEWS_ARTICLES } from '@/lib/mockNews';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

function formatDate(dateInput?: string | Date | null): string {
  if (!dateInput) return new Date().toISOString().split('T')[0];
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
    return d.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const today = formatDate();
  const baseUrl = SITE_URL.replace(/\/$/, '');

  // 1. Các trang tĩnh công khai (chuẩn SEO đa ngôn ngữ có tiền tố locale /vi và /en)
  const staticPages = [
    { loc: `${baseUrl}/vi`, changefreq: 'daily', priority: '1.0', lastmod: today },
    { loc: `${baseUrl}/en`, changefreq: 'daily', priority: '0.9', lastmod: today },
    { loc: `${baseUrl}/vi/menu`, changefreq: 'daily', priority: '0.9', lastmod: today },
    { loc: `${baseUrl}/en/menu`, changefreq: 'daily', priority: '0.8', lastmod: today },
    { loc: `${baseUrl}/vi/news`, changefreq: 'daily', priority: '0.8', lastmod: today },
    { loc: `${baseUrl}/en/news`, changefreq: 'daily', priority: '0.7', lastmod: today },
    { loc: `${baseUrl}/vi/faq`, changefreq: 'weekly', priority: '0.7', lastmod: today },
    { loc: `${baseUrl}/en/faq`, changefreq: 'weekly', priority: '0.6', lastmod: today },
    { loc: `${baseUrl}/vi/about`, changefreq: 'monthly', priority: '0.6', lastmod: today },
    { loc: `${baseUrl}/en/about`, changefreq: 'monthly', priority: '0.5', lastmod: today },
    { loc: `${baseUrl}/vi/contact`, changefreq: 'monthly', priority: '0.6', lastmod: today },
    { loc: `${baseUrl}/en/contact`, changefreq: 'monthly', priority: '0.5', lastmod: today },
    { loc: `${baseUrl}/vi/store`, changefreq: 'monthly', priority: '0.6', lastmod: today },
    { loc: `${baseUrl}/en/store`, changefreq: 'monthly', priority: '0.5', lastmod: today },
  ];

  // 2. Lấy danh sách sản phẩm (Chi tiết món)
  let products: Array<{ slug: string; updated_at?: string }> = [];
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from('products')
        .select('slug, updated_at')
        .eq('is_active', true);
      if (!error && data && data.length > 0) {
        products = data;
      }
    }
  } catch (e) {
    console.error('Error fetching products for sitemap.xml:', e);
  }

  if (products.length === 0) {
    products = MOCK_PRODUCTS.map((p) => ({ slug: p.slug }));
  }

  // 3. Lấy danh sách bài viết Tin tức / Blog
  let articles: Array<{ slug: string; updated_at?: string; published_at?: string }> = [];
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from('news')
        .select('slug, updated_at, published_at')
        .eq('status', 'PUBLISHED');
      if (!error && data && data.length > 0) {
        articles = data;
      }
    }
  } catch (e) {
    console.error('Error fetching news articles for sitemap.xml:', e);
  }

  if (articles.length === 0) {
    articles = MOCK_NEWS_ARTICLES.map((a) => ({ slug: a.slug, published_at: a.published_at }));
  }

  // Ghép toàn bộ URLs
  const urls: Array<{ loc: string; lastmod: string; changefreq: string; priority: string }> = [
    ...staticPages,
  ];

  for (const p of products) {
    const lastmod = formatDate(p.updated_at);
    urls.push({
      loc: `${baseUrl}/vi/menu/${p.slug}`,
      lastmod,
      changefreq: 'weekly',
      priority: '0.8',
    });
    urls.push({
      loc: `${baseUrl}/en/menu/${p.slug}`,
      lastmod,
      changefreq: 'weekly',
      priority: '0.7',
    });
  }

  for (const a of articles) {
    const lastmod = formatDate(a.updated_at || a.published_at);
    urls.push({
      loc: `${baseUrl}/vi/news/${a.slug}`,
      lastmod,
      changefreq: 'weekly',
      priority: '0.7',
    });
    urls.push({
      loc: `${baseUrl}/en/news/${a.slug}`,
      lastmod,
      changefreq: 'weekly',
      priority: '0.6',
    });
  }

  // Xây dựng XML chuẩn Google Sitemap
  const xmlEntries = urls
    .map(
      (item) => `  <url>
    <loc>${escapeXml(item.loc)}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
    )
    .join('\n');

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;

  return new NextResponse(xmlContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
