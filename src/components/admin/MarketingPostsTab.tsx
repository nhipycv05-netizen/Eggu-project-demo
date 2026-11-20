'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Trash2,
  CheckCircle2,
  Clock,
  Camera,
  Bot,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import SafeImage from '@/components/ui/SafeImage';
import {
  getMarketingPostsAction,
  markPostAsCopiedAction,
  updatePostStatusAction,
  deleteMarketingPostAction,
  MarketingPost,
} from '@/features/marketing/actions';

export default function MarketingPostsTab() {
  const [posts, setPosts] = useState<MarketingPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [notification, setNotification] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMarketingPostsAction();
      if (res.ok) {
        setPosts(res.data);
        if (res.error) {
          setWarningMessage(res.error);
        } else {
          setWarningMessage(null);
        }
      } else {
        setWarningMessage(res.error || 'Không thể tải danh sách bài viết');
      }
    } catch {
      setWarningMessage('Lỗi kết nối khi tải bài viết.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleCopyContent = async (post: MarketingPost) => {
    try {
      await navigator.clipboard.writeText(post.content);
      setCopiedId(post.id);
      showToast('Đã sao chép nội dung bài viết!');

      if (post.status === 'PENDING') {
        await markPostAsCopiedAction(post.id);
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, status: 'COPIED' } : p))
        );
      }

      setTimeout(() => {
        setCopiedId(null);
      }, 2500);
    } catch {
      showToast('Không thể tự động sao chép. Vui lòng copy thủ công.');
    }
  };

  const handleCopyLink = async (url: string, label: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(url);
      showToast(`Đã sao chép link ${label}!`);
      setTimeout(() => {
        setCopiedLink(null);
      }, 2500);
    } catch {
      showToast('Không thể sao chép đường link.');
    }
  };

  const handleStatusChange = async (
    id: string,
    newStatus: 'PENDING' | 'COPIED' | 'PUBLISHED' | 'ARCHIVED'
  ) => {
    const res = await updatePostStatusAction(id, newStatus);
    if (res.ok) {
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
      showToast(
        newStatus === 'PUBLISHED'
          ? 'Đã đánh dấu bài viết: ĐÃ ĐĂNG'
          : 'Đã cập nhật trạng thái'
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) return;
    const res = await deleteMarketingPostAction(id);
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      showToast('Đã xóa bài viết thành công.');
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (filterStatus === 'ALL') return true;
    return post.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E1B18] text-[#EAAA08] px-5 py-3 rounded-xl shadow-2xl border border-[#EAAA08]/30 flex items-center space-x-3 text-sm font-bold animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Panel */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#EAAA08]/15 rounded-xl text-[#EAAA08]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-neutral-900 tracking-tight">
              Bài Viết Social (n8n Tự Động)
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
            Các bài viết do n8n áp dụng 8 kỹ năng Marketing & Kiểm duyệt hàng ngày.
            Nhân viên chỉ cần bấm <strong className="text-neutral-700">Sao chép</strong> để dán lên Fanpage Facebook (bài viết hoàn toàn độc lập, không hiển thị trên website người dùng).
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchPosts}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Warning message if table not yet migrated */}
      {warningMessage && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Lưu ý cấu hình:</p>
            <p className="mt-0.5">{warningMessage}</p>
            <p className="text-[11px] text-amber-700 mt-1">
              File migration đã được tạo tại: <code>supabase/migrations/20261120000000_create_marketing_posts.sql</code>. Bạn chỉ cần chạy file này trên Supabase SQL Editor.
            </p>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
        <div className="flex items-center space-x-2">
          {[
            { id: 'ALL', label: 'Tất cả', count: posts.length },
            {
              id: 'PENDING',
              label: 'Chờ đăng',
              count: posts.filter((p) => p.status === 'PENDING').length,
            },
            {
              id: 'COPIED',
              label: 'Đã sao chép',
              count: posts.filter((p) => p.status === 'COPIED').length,
            },
            {
              id: 'PUBLISHED',
              label: 'Đã lên sóng',
              count: posts.filter((p) => p.status === 'PUBLISHED').length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                filterStatus === tab.id
                  ? 'bg-[#1E1B18] text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded-full font-black">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#EAAA08] animate-spin" />
          <p className="text-xs font-bold text-neutral-400">Đang tải danh sách bài viết...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-neutral-300 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EAAA08]/15 text-[#EAAA08] flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-neutral-800 text-sm">Chưa có bài viết nào trong danh mục này</h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            Khi n8n chạy lịch 08:30 sáng hàng ngày (hoặc bấm chạy thử), các bài viết mới kèm ảnh thật và ảnh AI sẽ tự động xuất hiện tại đây để nhân viên vào copy.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredPosts.map((post) => {
            const isCopied = copiedId === post.id || post.status === 'COPIED';
            const isPublished = post.status === 'PUBLISHED';

            return (
              <div
                key={post.id}
                className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden transition hover:border-[#EAAA08]/50"
              >
                {/* Post Top Details */}
                <div className="p-5 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-3 bg-neutral-50/50">
                  <div className="flex items-center space-x-2.5">
                    <span className="px-3 py-1 bg-[#EAAA08]/15 text-[#B58500] font-black text-xs rounded-lg">
                      {post.dish_name || 'Sandwich Trứng'}
                    </span>
                    {post.dish_category && (
                      <span className={`px-2 py-0.5 font-bold text-[10px] rounded-md flex items-center space-x-1 ${
                        post.dish_category.includes('Threads')
                          ? 'bg-neutral-900 text-white'
                          : post.dish_category.includes('Instagram')
                          ? 'bg-pink-600 text-white'
                          : post.dish_category.includes('Facebook')
                          ? 'bg-blue-600 text-white'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        <span>{post.dish_category}</span>
                      </span>
                    )}
                    {post.target_angle && (
                      <span className="px-2.5 py-1 bg-neutral-200/70 text-neutral-700 font-bold text-[11px] rounded-lg">
                        {post.target_angle}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <div className="flex items-center space-x-1 text-neutral-400 font-medium text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(post.created_at).toLocaleString('vi-VN')}</span>
                    </div>

                    {isPublished ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[11px] font-bold flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>Đã lên sóng</span>
                      </span>
                    ) : isCopied ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold">
                        Đã sao chép
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold">
                        Mới · Chờ đăng
                      </span>
                    )}
                  </div>
                </div>

                {/* Post Main Body */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Caption text */}
                  <div className="lg:col-span-7 space-y-4">
                    <div>
                      <h4 className="font-black text-base text-neutral-900 leading-snug">
                        {post.title}
                      </h4>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {post.dish_category ? `Danh mục: ${post.dish_category}` : ''}{' '}
                        {post.dish_price ? `· Giá: ${post.dish_price}` : ''}
                      </p>
                    </div>

                    {/* Preformatted caption with copy overlay */}
                    <div className="relative group">
                      <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/80 text-xs text-neutral-800 leading-relaxed whitespace-pre-line max-h-72 overflow-y-auto font-sans select-all">
                        {post.content}
                      </div>
                    </div>

                    {/* Prominent Copy Action Button */}
                    <div className="flex items-center space-x-3 pt-1">
                      <button
                        onClick={() => handleCopyContent(post)}
                        className={`flex-1 flex items-center justify-center space-x-2 px-5 py-3 rounded-xl text-xs font-black shadow-xs transition ${
                          isCopied
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-[#EAAA08] text-[#1E1B18] hover:bg-[#d69807]'
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>ĐÃ SAO CHÉP BÀI VIẾT</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>📋 SAO CHÉP BÀI VIẾT ĐỂ ĐĂNG FB</span>
                          </>
                        )}
                      </button>

                      {!isPublished && (
                        <button
                          onClick={() => handleStatusChange(post.id, 'PUBLISHED')}
                          title="Đánh dấu bài viết đã được đăng lên Fanpage"
                          className="px-3.5 py-3 border border-neutral-200 text-neutral-600 hover:text-green-700 hover:border-green-300 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span>Đã đăng xong</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(post.id)}
                        title="Xóa bài viết này"
                        className="p-3 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Right Column: 2 Sections (4-5 Real Photos vs 1 AI Generated Concept Photo) */}
                  <div className="lg:col-span-5 space-y-4">
                    <span className="text-xs font-bold text-neutral-500 block uppercase tracking-wider">
                      Hình ảnh đính kèm (Album ảnh thật & Ảnh AI thiết kế riêng)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Real Photos Album Card (4-5 Photos) */}
                      {(() => {
                        let photosList: string[] = [];
                        if (post.real_photo_url) {
                          if (post.real_photo_url.startsWith('[')) {
                            try {
                              photosList = JSON.parse(post.real_photo_url);
                            } catch {
                              photosList = [post.real_photo_url];
                            }
                          } else {
                            photosList = [post.real_photo_url];
                          }
                        }

                        const mainPhoto = photosList[0] || null;

                        return (
                          <div className="border border-neutral-200 rounded-xl p-2.5 space-y-2 bg-neutral-50/50 flex flex-col justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-[11px] font-black text-neutral-700">
                                <span className="flex items-center space-x-1">
                                  <Camera className="w-3.5 h-3.5 text-blue-600" />
                                  <span>ẢNH THẬT</span>
                                </span>
                                <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                                  {photosList.length > 1
                                    ? `📸 Album ${photosList.length} ảnh`
                                    : (post.dish_category?.includes('Threads')
                                    ? '🧵 Threads'
                                    : post.dish_category?.includes('Instagram')
                                    ? '📸 IG'
                                    : post.dish_category?.includes('Facebook')
                                    ? '📘 FB'
                                    : '📸 Gốc 100%')}
                                </span>
                              </div>

                              {/* Main Featured Photo */}
                              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-neutral-200 border border-neutral-200">
                                {mainPhoto ? (
                                  <SafeImage
                                    src={mainPhoto}
                                    alt="Ảnh thật EGGU"
                                    fill
                                    className="object-cover"
                                    sizes="180px"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-neutral-400 text-[10px]">
                                    Chưa có ảnh
                                  </div>
                                )}
                              </div>

                              {/* Thumbnail Strip for 4-5 photos */}
                              {photosList.length > 1 && (
                                <div className="grid grid-cols-4 gap-1 pt-1">
                                  {photosList.map((url, idx) => (
                                    <a
                                      key={idx}
                                      href={url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="relative aspect-square rounded-md overflow-hidden border border-neutral-200 hover:border-blue-500 transition group"
                                      title={`Xem ảnh thật số ${idx + 1}`}
                                    >
                                      <SafeImage
                                        src={url}
                                        alt={`Ảnh thật ${idx + 1}`}
                                        fill
                                        className="object-cover group-hover:scale-105 transition"
                                        sizes="45px"
                                      />
                                      <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[8px] font-bold px-1 rounded-tl">
                                        #{idx + 1}
                                      </div>
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Action Buttons for Real Photos */}
                            {photosList.length > 0 && (
                              <div className="flex items-center space-x-1 pt-2">
                                <a
                                  href={mainPhoto!}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex-1 py-1 text-center bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-700 rounded-md text-[10px] font-bold flex items-center justify-center space-x-1"
                                >
                                  <span>Mở {photosList.length > 1 ? `album (${photosList.length})` : 'ảnh'}</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                                <button
                                  onClick={() =>
                                    handleCopyLink(
                                      photosList.join('\n'),
                                      photosList.length > 1 ? 'tất cả link ảnh thật' : 'ảnh thật'
                                    )
                                  }
                                  className="p-1 bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-600 rounded-md"
                                  title={photosList.length > 1 ? 'Sao chép tất cả link ảnh thật' : 'Sao chép link ảnh thật'}
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {/* AI Dedicated Graphic / Concept Card (Based on Caption) */}
                      <div className="border border-neutral-200 rounded-xl p-2.5 space-y-2 bg-neutral-50/50 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-black text-neutral-700">
                            <span className="flex items-center space-x-1">
                              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                              <span>ẢNH AI THIẾT KẾ</span>
                            </span>
                            <span className="text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold">
                              Theo Caption
                            </span>
                          </div>

                          <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-neutral-200 border border-neutral-200">
                            {post.ai_photo_url ? (
                              <SafeImage
                                src={post.ai_photo_url}
                                alt="Ảnh AI thiết kế riêng theo Caption"
                                fill
                                className="object-cover"
                                sizes="180px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-400 text-[10px]">
                                Chưa có ảnh AI
                              </div>
                            )}
                          </div>

                          <p className="text-[10px] text-neutral-500 italic line-clamp-2 px-0.5">
                            🎨 Thiết kế độc quyền riêng 1 tấm dựa trên câu chuyện & cảm xúc của caption.
                          </p>
                        </div>

                        {post.ai_photo_url && (
                          <div className="flex items-center space-x-1 pt-2">
                            <a
                              href={post.ai_photo_url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex-1 py-1 text-center bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-700 rounded-md text-[10px] font-bold flex items-center justify-center space-x-1"
                            >
                              <span>Mở ảnh AI</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                            <button
                              onClick={() =>
                                handleCopyLink(post.ai_photo_url!, 'ảnh AI thiết kế riêng')
                              }
                              className="p-1 bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-600 rounded-md"
                              title="Sao chép link ảnh AI"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
