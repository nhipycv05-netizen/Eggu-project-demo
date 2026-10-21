'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Upload,
  Image as ImageIcon,
  X,
  RefreshCw,
  AlertCircle,
  Wand2,
} from 'lucide-react';
import SafeImage from '@/components/ui/SafeImage';
import {
  saveNewsArticleAction,
  deleteNewsArticleAction,
  uploadNewsImageAction,
} from '@/features/news/actions';

interface NewsArticle {
  id: string;
  title_vi: string;
  title_en: string;
  slug: string;
  summary_vi: string;
  summary_en: string;
  content_vi: string | null;
  content_en: string | null;
  thumbnail_url: string | null;
  status: 'DRAFT' | 'PUBLISHED';
  published_at: string;
}

/**
 * Safely extracts a string error message from any unknown error type
 * to prevent React error #441 (passing objects as React children).
 */
function extractErrorMessage(err: unknown): string {
  if (!err) return 'Lỗi không xác định';
  if (typeof err === 'string') return err;
  if (err instanceof Error) return err.message;
  if (typeof err === 'object') {
    const record = err as Record<string, unknown>;
    if (typeof record.message === 'string') return record.message;
    if (typeof record.error === 'string') return record.error;
    if (typeof record.error_description === 'string') return record.error_description;
    try {
      return JSON.stringify(err);
    } catch {
      return 'Lỗi không xác định';
    }
  }
  return String(err);
}

export default function NewsTab() {
  const supabase = createClient();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [titleVi, setTitleVi] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [slug, setSlug] = useState('');
  const [summaryVi, setSummaryVi] = useState('');
  const [summaryEn, setSummaryEn] = useState('');
  const [contentVi, setContentVi] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');

  const fetchArticles = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (err: unknown) {
      console.error('Lỗi khi tải danh sách bài viết:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleEditClick = (article: NewsArticle) => {
    setEditingArticle(article);
    setTitleVi(article.title_vi || '');
    setTitleEn(article.title_en || '');
    setSlug(article.slug || '');
    setSummaryVi(article.summary_vi || '');
    setSummaryEn(article.summary_en || '');
    setContentVi(article.content_vi || '');
    setContentEn(article.content_en || '');
    setThumbnailUrl(article.thumbnail_url || '');
    setStatus(article.status || 'DRAFT');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingArticle(null);
    setTitleVi('');
    setTitleEn('');
    setSlug('');
    setSummaryVi('');
    setSummaryEn('');
    setContentVi('');
    setContentEn('');
    setThumbnailUrl('');
    setStatus('DRAFT');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Helper to generate a clean, safe slug from Vietnamese / English title
  const generateCleanSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleAutoSlug = () => {
    const text = titleVi || titleEn;
    if (text) {
      setSlug(generateCleanSlug(text));
    }
  };

  // Upload image to Supabase Storage bucket 'news'
  const processImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WebP, GIF)!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Dung lượng ảnh vượt quá giới hạn 5MB. Vui lòng chọn ảnh nhỏ hơn.');
      return;
    }

    setUploading(true);
    setFormError(null);

    // Show instant preview
    const previewUrl = URL.createObjectURL(file);
    setThumbnailUrl(previewUrl);

    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const cleanExt = fileExt.toLowerCase().replace(/[^a-z0-9]/g, '');
      const fileName = `news-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${cleanExt}`;
      const filePath = `${fileName}`;

      // 1. Direct upload from browser to Supabase Storage bucket 'news'
      const { error: uploadError } = await supabase.storage
        .from('news')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (!uploadError) {
        const { data: pubData } = supabase.storage
          .from('news')
          .getPublicUrl(filePath);

        if (pubData?.publicUrl) {
          setThumbnailUrl(pubData.publicUrl);
          setFormError(null);
          return;
        }
      }

      // 2. Fallback: try via server action if client RLS restrictions occur
      const formData = new FormData();
      formData.append('file', file);
      const serverRes = await uploadNewsImageAction(formData);

      if (serverRes.ok && serverRes.url) {
        setThumbnailUrl(serverRes.url);
        setFormError(null);
        return;
      }

      const finalMsg = serverRes.error || extractErrorMessage(uploadError);
      throw new Error(finalMsg);
    } catch (err: unknown) {
      console.error('Lỗi khi tải ảnh lên Storage:', err);
      const msg = extractErrorMessage(err);
      setFormError(`Tải ảnh lên thất bại: ${msg}`);
      alert(`Tải ảnh lên thất bại: ${msg}`);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveImage = () => {
    setThumbnailUrl('');
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    const finalSlug = slug.trim() || generateCleanSlug(titleVi || titleEn);

    const payload = {
      id: editingArticle?.id,
      title_vi: titleVi,
      title_en: titleEn,
      slug: finalSlug,
      summary_vi: summaryVi,
      summary_en: summaryEn,
      content_vi: contentVi || null,
      content_en: contentEn || null,
      thumbnail_url: thumbnailUrl || null,
      status,
      published_at: editingArticle ? editingArticle.published_at : new Date().toISOString(),
    };

    try {
      const result = await saveNewsArticleAction(payload);

      if (!result.ok) {
        const errMsg = result.error || 'Lỗi không xác định khi lưu bài viết';
        setFormError(errMsg);
        alert(`Lưu bài viết thất bại: ${errMsg}`);
        return;
      }

      setIsModalOpen(false);
      await fetchArticles();
    } catch (err: unknown) {
      console.error('Lỗi khi lưu bài viết:', err);
      const errMsg = extractErrorMessage(err);
      setFormError(errMsg);
      alert(`Lưu bài viết thất bại: ${errMsg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) return;
    setLoading(true);

    try {
      const result = await deleteNewsArticleAction(id);
      if (!result.ok) {
        throw new Error(result.error || 'Không thể xóa bài viết');
      }
      await fetchArticles();
    } catch (err: unknown) {
      console.error('Lỗi khi xóa bài viết:', err);
      const errMsg = extractErrorMessage(err);
      alert(`Xóa bài viết thất bại: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#1E1B18]">Tin Tức & Sự Kiện</h2>
          <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">
            Quản lý các bài viết tin tức, thông báo ưu đãi và sự kiện
          </p>
        </div>

        <button
          onClick={handleAddNewClick}
          className="px-4 py-2 bg-[#EAAA08] text-[#1E1B18] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#EAAA08]/90 transition flex items-center space-x-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4 stroke-[3px]" />
          <span>Thêm Bài Viết Mới</span>
        </button>
      </div>

      {loading && articles.length === 0 ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#EAAA08] animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                  <th className="p-4">Ảnh bìa</th>
                  <th className="p-4">Tiêu đề bài viết</th>
                  <th className="p-4">Đường dẫn URL (Slug)</th>
                  <th className="p-4">Ngày đăng</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-700">
                {articles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-neutral-400 font-bold">
                      Không có bài viết nào.
                    </td>
                  </tr>
                ) : (
                  articles.map((article) => (
                    <tr key={article.id} className="hover:bg-neutral-50/50 transition">
                      <td className="p-4">
                        <div className="w-14 h-10 rounded-lg overflow-hidden border border-neutral-200 relative bg-neutral-100 flex-shrink-0">
                          <SafeImage
                            src={article.thumbnail_url || '/images/hero-sandwich.jpg'}
                            alt={article.title_vi || 'Ảnh bài viết'}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-4 space-y-0.5">
                        <p className="font-extrabold text-neutral-900 max-w-xs truncate">{article.title_vi}</p>
                        <p className="text-[10px] text-neutral-400 max-w-xs truncate">{article.title_en}</p>
                      </td>
                      <td className="p-4 text-neutral-500 font-mono text-[11px] max-w-[200px] truncate" title={article.slug}>
                        {article.slug}
                      </td>
                      <td className="p-4 text-neutral-500 font-medium">
                        {article.published_at ? new Date(article.published_at).toLocaleDateString('vi-VN') : '—'}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                            article.status === 'PUBLISHED'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-neutral-50 text-neutral-600 border-neutral-200'
                          }`}
                        >
                          {article.status === 'PUBLISHED' ? 'Đã xuất bản' : 'Bản nháp'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => handleEditClick(article)}
                          className="p-2 hover:bg-neutral-200 rounded-lg text-neutral-500 hover:text-neutral-900 transition"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-neutral-400 hover:text-red-600 transition"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1E1B18]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-3xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <h3 className="text-xl font-black text-neutral-900">
                {editingArticle ? 'Chỉnh Sửa Bài Viết' : 'Thêm Bài Viết Mới'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Banner (Always string, never object) */}
            {formError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-extrabold text-red-800">Thông báo lỗi</p>
                  <p className="text-red-600 leading-relaxed">{String(formError)}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSaveArticle} className="space-y-5 text-xs font-semibold text-neutral-700">
              {/* Image Upload / Preview Area */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-neutral-500 font-black block tracking-wider">
                  Ảnh Đại Diện Bài Viết (Thumbnail)
                </label>

                {/* Hidden Native File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {thumbnailUrl ? (
                  /* Preview Box */
                  <div className="relative rounded-2xl border-2 border-neutral-200 overflow-hidden bg-neutral-900 group">
                    <div className="relative aspect-video w-full max-h-56 bg-neutral-100">
                      <SafeImage
                        src={thumbnailUrl}
                        alt="Xem trước ảnh bài viết"
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Action Bar */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="px-4 py-2 bg-white text-neutral-900 font-bold rounded-xl shadow-md hover:bg-neutral-100 transition flex items-center gap-1.5 text-xs uppercase tracking-wider"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${uploading ? 'animate-spin' : ''}`} />
                        <span>Đổi ảnh</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        disabled={uploading}
                        className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl shadow-md hover:bg-red-700 transition flex items-center gap-1.5 text-xs uppercase tracking-wider"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa ảnh</span>
                      </button>
                    </div>

                    {uploading && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center gap-2 text-neutral-800 font-bold">
                        <Loader2 className="w-5 h-5 animate-spin text-[#EAAA08]" />
                        <span>Đang tải ảnh lên máy chủ...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Upload Dropzone */
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-3 ${
                      isDragging
                        ? 'border-[#EAAA08] bg-[#FFFBEB]'
                        : 'border-neutral-300 hover:border-[#EAAA08] hover:bg-neutral-50/70 bg-[#FAFAFA]'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-neutral-200 flex items-center justify-center text-[#EAAA08]">
                      {uploading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Upload className="w-6 h-6" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <p className="font-extrabold text-neutral-800 text-sm">
                        {uploading ? 'Đang xử lý tải ảnh lên máy chủ...' : 'Nhấp để chọn tệp hoặc kéo thả ảnh vào đây'}
                      </p>
                      <p className="text-[11px] text-neutral-400 font-medium">
                        Hỗ trợ PNG, JPG, JPEG, WebP, GIF (tối đa 5MB)
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={uploading}
                      className="px-4 py-2 bg-white border border-neutral-300 hover:border-[#EAAA08] text-neutral-700 font-bold rounded-xl text-xs uppercase tracking-wider shadow-2xs hover:bg-[#FFFBEB] transition"
                    >
                      Chọn tệp ảnh từ máy tính
                    </button>
                  </div>
                )}
              </div>

              {/* Title inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Tiêu đề (Tiếng Việt)</label>
                  <input
                    type="text"
                    required
                    value={titleVi}
                    onChange={(e) => {
                      setTitleVi(e.target.value);
                      if (!slug) {
                        setSlug(generateCleanSlug(e.target.value));
                      }
                    }}
                    placeholder="VD: Khai trương chi nhánh mới"
                    className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Tiêu đề (Tiếng Anh)</label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="VD: Grand Opening New Store"
                    className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                  />
                </div>
              </div>

              {/* Slug & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase text-neutral-400 font-black block">Đường dẫn URL (Slug)</label>
                    <button
                      type="button"
                      onClick={handleAutoSlug}
                      className="text-[10px] text-[#EAAA08] hover:underline font-bold flex items-center gap-1"
                    >
                      <Wand2 className="w-2.5 h-2.5" />
                      <span>Tạo tự động</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="vd: khai-truong-chi-nhanh-moi"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08] font-mono text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Trạng thái bài viết</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'DRAFT' | 'PUBLISHED')}
                    className="w-full p-3 border border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-[#EAAA08] font-bold"
                  >
                    <option value="DRAFT">Bản nháp (DRAFT)</option>
                    <option value="PUBLISHED">Đã xuất bản (PUBLISHED)</option>
                  </select>
                </div>
              </div>

              {/* Summaries */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-400 font-black block">Tóm tắt ngắn (Tiếng Việt)</label>
                <textarea
                  required
                  value={summaryVi}
                  onChange={(e) => setSummaryVi(e.target.value)}
                  rows={2}
                  placeholder="Mô tả ngắn gọn nội dung bài viết..."
                  className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08] resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-400 font-black block">Tóm tắt ngắn (Tiếng Anh)</label>
                <textarea
                  required
                  value={summaryEn}
                  onChange={(e) => setSummaryEn(e.target.value)}
                  rows={2}
                  placeholder="Brief summary in English..."
                  className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08] resize-none"
                />
              </div>

              {/* Contents */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-400 font-black block">Nội dung chi tiết (Tiếng Việt)</label>
                <textarea
                  value={contentVi}
                  onChange={(e) => setContentVi(e.target.value)}
                  rows={6}
                  placeholder="Nhập nội dung bài viết..."
                  className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08] text-xs leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-400 font-black block">Nội dung chi tiết (Tiếng Anh)</label>
                <textarea
                  value={contentEn}
                  onChange={(e) => setContentEn(e.target.value)}
                  rows={6}
                  placeholder="Enter detailed content..."
                  className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08] text-xs leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving || uploading}
                  className="flex-1 py-3 border border-neutral-200 text-neutral-700 font-bold uppercase rounded-xl hover:bg-neutral-50 transition disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 py-3 bg-[#EAAA08] text-[#1E1B18] font-bold uppercase rounded-xl hover:bg-[#EAAA08]/90 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>{saving ? 'Đang lưu...' : 'Lưu bài viết'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
