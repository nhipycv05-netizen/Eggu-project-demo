'use client';

import React, { useState } from 'react';
import SafeImage from '@/components/ui/SafeImage';
import { Link } from '@/i18n/navigation';
import { Calendar, ArrowRight, LayoutGrid, Sparkles, Newspaper } from 'lucide-react';
import TikTokCoverflowSlider, { NewsSlideItem } from './TikTokCoverflowSlider';

interface TikTokNewsContainerProps {
  articles: NewsSlideItem[];
  locale?: string;
  title: string;
  readMoreText: string;
  emptyNewsText: string;
}

export default function TikTokNewsContainer({
  articles,
  locale = 'vi',
  title,
  readMoreText,
  emptyNewsText,
}: TikTokNewsContainerProps) {
  const [viewMode, setViewMode] = useState<'coverflow' | 'grid'>('coverflow');
  const isVi = locale === 'vi';

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-[#E5E7EB] space-y-3">
        <Newspaper className="w-12 h-12 text-[#9CA3AF] mx-auto" />
        <p className="text-neutral-500 font-bold">{emptyNewsText}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header with Title & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e0352b]/20 pb-4 text-left">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-[#e0352b]">
              {title}
            </h1>
            <span className="bg-[#e0352b]/10 text-[#e0352b] text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              TikTok
            </span>
          </div>
          <p className="text-xs sm:text-[13px] text-neutral-500 font-medium">
            {isVi
              ? 'Khám phá video và bài viết mới nhất từ kênh TikTok của Eggu Sandwich'
              : 'Explore the latest trending videos & stories from Eggu Sandwich TikTok channel'}
          </p>
        </div>

        {/* View Switcher Buttons */}
        <div className="inline-flex items-center p-1 bg-neutral-100 rounded-2xl border border-neutral-200/80 self-start sm:self-auto shadow-2xs">
          <button
            onClick={() => setViewMode('coverflow')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'coverflow'
                ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200/60'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e0352b]" />
            <span>Coverflow</span>
          </button>

          <button
            onClick={() => setViewMode('grid')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200/60'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{isVi ? 'Lưới' : 'Grid'}</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'coverflow' ? (
        <TikTokCoverflowSlider articles={articles} locale={locale} />
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pt-2">
          {articles.map((article) => {
            const formattedDate = article.published_at
              ? new Date(article.published_at).toLocaleDateString(
                  isVi ? 'vi-VN' : 'en-US',
                  { year: 'numeric', month: 'long', day: 'numeric' }
                )
              : '';

            const itemTitle =
              (isVi ? article.title_vi : article.title_en) ||
              article.title_vi ||
              'Tin tức EGGU';
            const rawSummary =
              (isVi ? article.summary_vi : article.summary_en) ||
              article.summary_vi ||
              '';
            const rawContent =
              (isVi ? article.content_vi : article.content_en) ||
              article.content_vi ||
              '';
            const cleanContentSnippet = rawContent
              ? rawContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
              : '';
            const summary =
              rawSummary ||
              (cleanContentSnippet
                ? cleanContentSnippet.slice(0, 160) +
                  (cleanContentSnippet.length > 160 ? '...' : '')
                : '');

            return (
              <article
                key={article.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#E5E7EB] group hover:border-[#E53935]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Thumbnail */}
                <Link
                  href={`/news/${encodeURIComponent(article.slug)}`}
                  className="block relative aspect-video overflow-hidden bg-neutral-100"
                >
                  <SafeImage
                    src={article.thumbnail_url || '/images/hero-sandwich.jpg'}
                    alt={itemTitle}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 380px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#1E1B18]/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                    {isVi ? 'Tin tức' : 'News'}
                  </div>
                </Link>

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    {/* Date */}
                    {formattedDate && (
                      <div className="flex items-center space-x-2 text-xs font-bold text-[#9CA3AF]">
                        <Calendar className="w-3.5 h-3.5 text-[#E53935]" />
                        <span>{formattedDate}</span>
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-lg font-black text-[#111111] line-clamp-2 leading-snug group-hover:text-[#E53935] transition duration-200">
                      <Link href={`/news/${encodeURIComponent(article.slug)}`}>
                        {itemTitle}
                      </Link>
                    </h2>

                    {/* Summary */}
                    {summary && (
                      <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-3 font-medium">
                        {summary}
                      </p>
                    )}
                  </div>

                  {/* Footer / CTA */}
                  <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                    <Link
                      href={`/news/${encodeURIComponent(article.slug)}`}
                      className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#E53935] group-hover:text-[#D32F2F] transition duration-150"
                    >
                      <span>{readMoreText}</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

