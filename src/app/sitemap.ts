import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { SITE_URL } from '@/lib/seo';
import { MOCK_PRODUCTS } from '@/lib/mockProducts';
import { MOCK_NEWS_ARTICLES } from '@/lib/mockNews';

export const revalidate = 3600; // Cập nhật sitemap mỗi 1 giờ

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // 1. Danh sách các trang tĩnh công khai chính
  const staticRoutes: Array<{
    path: string;
    changeFrequency: 'daily' | 'weekly' | 'monthly';
    priority: number;
  }> = [
    { path: '', changeFrequency: 'daily', priority: 1.0 }, // Trang chủ
    { path: '/menu', changeFrequency: 'daily', priority: 0.9 }, // Thực đơn
    { path: '/news', changeFrequency: 'daily', priority: 0.8 }, // Tin tức / Blog
    { path: '/faq', changeFrequency: 'weekly', priority: 0.7 }, // FAQ
    { path: '/about', changeFrequency: 'monthly', priority: 0.6 }, // Giới thiệu
    { path: '/contact', changeFrequency: 'monthly', priority: 0.6 }, // Liên hệ
    { path: '/store', changeFrequency: 'monthly', priority: 0.6 }, // Cửa hàng
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Tạo URL vi và en cho các trang tĩnh
  for (const route of staticRoutes) {
    const viUrl = `${SITE_URL}${route.path}`;
    const enUrl = `${SITE_URL}/en${route.path}`;

    // Bản tiếng Việt (mặc định tại root /)
    sitemapEntries.push({
      url: viUrl,
      lastModified: currentDate,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          vi: viUrl,
          en: enUrl,
          'x-default': viUrl,
        },
      },
    });

    // Bản tiếng Anh (/en)
    sitemapEntries.push({
      url: enUrl,
      lastModified: currentDate,
      changeFrequency: route.changeFrequency,
      priority: Math.max(0.1, Number((route.priority - 0.05).toFixed(2))),
      alternates: {
        languages: {
          vi: viUrl,
          en: enUrl,
          'x-default': viUrl,
        },
      },
    });
  }

  // 2. Lấy danh sách sản phẩm (Chi tiết món) từ Supabase (fallback sang MOCK_PRODUCTS)
  let productSlugs: Array<{ slug: string; updated_at?: string }> = [];

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
        productSlugs = data;
      }
    }
  } catch (err) {
    console.error('Lỗi khi lấy danh sách sản phẩm cho sitemap:', err);
  }

  // Nếu DB trống hoặc chưa kết nối, sử dụng mock fallback
  if (productSlugs.length === 0) {
    productSlugs = MOCK_PRODUCTS.map((p) => ({ slug: p.slug }));
  }

  for (const product of productSlugs) {
    const viUrl = `${SITE_URL}/menu/${product.slug}`;
    const enUrl = `${SITE_URL}/en/menu/${product.slug}`;
    const lastMod = product.updated_at ? new Date(product.updated_at) : currentDate;

    sitemapEntries.push({
      url: viUrl,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: {
          vi: viUrl,
          en: enUrl,
          'x-default': viUrl,
        },
      },
    });

    sitemapEntries.push({
      url: enUrl,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.75,
      alternates: {
        languages: {
          vi: viUrl,
          en: enUrl,
          'x-default': viUrl,
        },
      },
    });
  }

  // 3. Lấy danh sách bài viết Tin tức / Blog từ Supabase (fallback sang MOCK_NEWS_ARTICLES)
  let articleSlugs: Array<{ slug: string; updated_at?: string; published_at?: string }> = [];

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
        articleSlugs = data;
      }
    }
  } catch (err) {
    console.error('Lỗi khi lấy danh sách bài viết cho sitemap:', err);
  }

  // Fallback mock nếu DB trống
  if (articleSlugs.length === 0) {
    articleSlugs = MOCK_NEWS_ARTICLES.map((a) => ({ slug: a.slug, published_at: a.published_at }));
  }

  for (const article of articleSlugs) {
    const viUrl = `${SITE_URL}/news/${article.slug}`;
    const enUrl = `${SITE_URL}/en/news/${article.slug}`;
    const lastMod = article.updated_at
      ? new Date(article.updated_at)
      : article.published_at
        ? new Date(article.published_at)
        : currentDate;

    sitemapEntries.push({
      url: viUrl,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.7,
      alternates: {
        languages: {
          vi: viUrl,
          en: enUrl,
          'x-default': viUrl,
        },
      },
    });

    sitemapEntries.push({
      url: enUrl,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.65,
      alternates: {
        languages: {
          vi: viUrl,
          en: enUrl,
          'x-default': viUrl,
        },
      },
    });
  }

  return sitemapEntries;
}
