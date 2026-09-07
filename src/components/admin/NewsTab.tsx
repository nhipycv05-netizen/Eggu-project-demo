'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';

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

export default function NewsTab() {
  const supabase = createClient();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setTimeout(() => {
        setArticles(data || []);
        setLoading(false);
      }, 0);
    } catch (err) {
      console.error('Lỗi khi tải danh sách bài viết:', err);
      setTimeout(() => setLoading(false), 0);
    }
  }, [supabase]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleEditClick = (article: NewsArticle) => {
    setEditingArticle(article);
    setTitleVi(article.title_vi);
    setTitleEn(article.title_en);
    setSlug(article.slug);
    setSummaryVi(article.summary_vi);
    setSummaryEn(article.summary_en);
    setContentVi(article.content_vi || '');
    setContentEn(article.content_en || '');
    setThumbnailUrl(article.thumbnail_url || '');
    setStatus(article.status);
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
    setThumbnailUrl('/images/hero-sandwich.jpg');
    setStatus('DRAFT');
    setIsModalOpen(true);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title_vi: titleVi,
      title_en: titleEn,
      slug: slug || titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      summary_vi: summaryVi,
      summary_en: summaryEn,
      content_vi: contentVi || null,
      content_en: contentEn || null,
      thumbnail_url: thumbnailUrl || null,
      status,
      published_at: editingArticle ? editingArticle.published_at : new Date().toISOString(),
    };

    try {
      if (editingArticle) {
        const { error } = await supabase
          .from('news')
          .update(payload)
          .eq('id', editingArticle.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('news').insert(payload);
        if (error) throw error;
      }

      setIsModalOpen(false);
      await fetchArticles();
    } catch (err) {
      console.error('Lỗi khi lưu bài viết:', err);
      alert('Lưu bài viết thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) return;
    setLoading(true);

    try {
      const { error } = await supabase.from('news').delete().eq('id', id);
      if (error) throw error;
      await fetchArticles();
    } catch (err) {
      console.error('Lỗi khi xóa bài viết:', err);
      alert('Xóa bài viết thất bại');
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
                    <td colSpan={5} className="p-8 text-center text-neutral-400 font-bold">
                      Không có bài viết nào.
                    </td>
                  </tr>
                ) : (
                  articles.map((article) => (
                    <tr key={article.id} className="hover:bg-neutral-50/50 transition">
                      <td className="p-4 space-y-0.5">
                        <p className="font-extrabold text-neutral-900 max-w-xs truncate">{article.title_vi}</p>
                        <p className="text-[10px] text-neutral-400 max-w-xs truncate">{article.title_en}</p>
                      </td>
                      <td className="p-4 text-neutral-500 font-mono">{article.slug}</td>
                      <td className="p-4 text-neutral-500 font-medium">
                        {new Date(article.published_at).toLocaleDateString('vi-VN')}
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
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-neutral-400 hover:text-red-600 transition"
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
        <div className="fixed inset-0 bg-[#1E1B18]/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white border border-neutral-200 p-8 rounded-3xl w-full max-w-2xl shadow-xl max-h-[85vh] overflow-y-auto space-y-6">
            <h3 className="text-xl font-black text-neutral-900">
              {editingArticle ? 'Chỉnh Sửa Bài Viết' : 'Thêm Bài Viết Mới'}
            </h3>

            <form onSubmit={handleSaveArticle} className="space-y-4 text-xs font-semibold text-neutral-700">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Tiêu đề (Tiếng Việt)</label>
                  <input
                    type="text"
                    required
                    value={titleVi}
                    onChange={(e) => setTitleVi(e.target.value)}
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
                    className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Đường dẫn URL (Slug)</label>
                  <input
                    type="text"
                    placeholder="vd: khai-truong-chi-nhanh-moi"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Trạng thái</label>
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

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-400 font-black block">Tóm tắt ngắn (Tiếng Việt)</label>
                <textarea
                  required
                  value={summaryVi}
                  onChange={(e) => setSummaryVi(e.target.value)}
                  rows={2}
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
                  className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08] resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-400 font-black block">Nội dung chi tiết (Tiếng Việt) HTML</label>
                <textarea
                  value={contentVi}
                  onChange={(e) => setContentVi(e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08] font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-400 font-black block">Nội dung chi tiết (Tiếng Anh) HTML</label>
                <textarea
                  value={contentEn}
                  onChange={(e) => setContentEn(e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08] font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-400 font-black block">URL ảnh đại diện (Thumbnail)</label>
                <input
                  type="text"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-neutral-200 text-neutral-700 font-bold uppercase rounded-xl hover:bg-neutral-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#EAAA08] text-[#1E1B18] font-bold uppercase rounded-xl hover:bg-[#EAAA08]/90 transition"
                >
                  Lưu bài viết
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
