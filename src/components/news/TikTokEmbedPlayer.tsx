'use client';

import React, { useState } from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';

interface TikTokEmbedPlayerProps {
  videoId: string;
  username?: string;
  originalUrl?: string;
  title?: string;
}

export default function TikTokEmbedPlayer({
  videoId,
  username = 'eggu_sandwich',
  originalUrl,
  title,
}: TikTokEmbedPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const tiktokUrl = originalUrl || `https://www.tiktok.com/@${username}/video/${videoId}`;

  return (
    <div className="my-8 pt-2">
      <div className="bg-neutral-50/90 border border-neutral-200/90 rounded-3xl p-4 sm:p-6 shadow-xs max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-neutral-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shrink-0 shadow-xs">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.3 6.3 0 0 0 1.86-4.47V8.78a8.18 8.18 0 0 0 4.77 1.52V6.85a4.85 4.85 0 0 1-.86-.16z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-[#111]">TikTok Video</span>
                <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-md">Official</span>
              </div>
              <p className="text-[11px] text-neutral-500 font-medium">@{username}</p>
            </div>
          </div>

          <a
            href={tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-neutral-700 hover:text-[#e0352b] bg-white border border-neutral-200 hover:border-[#e0352b]/40 px-3 py-1.5 rounded-xl transition duration-150 shrink-0 shadow-2xs"
          >
            <span>Mở TikTok</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Player Container (Standard TikTok Vertical Ratio) */}
        <div className="relative w-full flex justify-center items-center">
          <div className="relative w-[325px] sm:w-[340px] max-w-full h-[580px] rounded-2xl overflow-hidden bg-neutral-900 shadow-md">
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-900 text-neutral-400 z-10">
                <Loader2 className="w-7 h-7 animate-spin text-[#e0352b]" />
                <span className="text-xs font-medium">Đang tải video TikTok...</span>
              </div>
            )}
            <iframe
              src={`https://www.tiktok.com/player/v1/${videoId}?embed_from=oembed&music_info=1&description=1`}
              title={title || `TikTok Video ${videoId}`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              onLoad={() => setIsLoading(false)}
            />
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-3 text-center">
          <p className="text-[11px] text-neutral-400">
            Xem video chất lượng cao và tương tác trực tiếp trên TikTok
          </p>
        </div>
      </div>
    </div>
  );
}

