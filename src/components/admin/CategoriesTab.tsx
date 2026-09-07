'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';

interface Category {
  id: string;
  name_vi: string;
  name_en: string;
  slug: string;
  is_active: boolean;
  sort_order: number;
}

export default function CategoriesTab() {
  const supabase = createClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [nameVi, setNameVi] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  const fetchCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setTimeout(() => {
        setCategories(data || []);
        setLoading(false);
      }, 0);
    } catch (err) {
      console.error('Lỗi khi tải danh mục:', err);
      setTimeout(() => setLoading(false), 0);
    }
  }, [supabase]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setNameVi(category.name_vi);
    setNameEn(category.name_en);
    setSlug(category.slug);
    setIsActive(category.is_active);
    setSortOrder(category.sort_order);
    setIsModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingCategory(null);
    setNameVi('');
    setNameEn('');
    setSlug('');
    setIsActive(true);
    setSortOrder(0);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name_vi: nameVi,
      name_en: nameEn,
      slug: slug || nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      is_active: isActive,
      sort_order: Number(sortOrder),
    };

    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(payload)
          .eq('id', editingCategory.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('categories').insert(payload);
        if (error) throw error;
      }

      setIsModalOpen(false);
      await fetchCategories();
    } catch (err) {
      console.error('Lỗi khi lưu danh mục:', err);
      alert('Lưu danh mục thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này? Tất cả sản phẩm thuộc danh mục sẽ chuyển thành Chưa phân loại.')) return;
    setLoading(true);

    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      await fetchCategories();
    } catch (err) {
      console.error('Lỗi khi xóa danh mục:', err);
      alert('Xóa danh mục thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#1E1B18]">Quản Lý Danh Mục</h2>
          <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">
            Thiết lập các nhóm danh mục cho thực đơn
          </p>
        </div>

        <button
          onClick={handleAddNewClick}
          className="px-4 py-2 bg-[#EAAA08] text-[#1E1B18] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#EAAA08]/90 transition flex items-center space-x-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4 stroke-[3px]" />
          <span>Thêm Danh Mục Mới</span>
        </button>
      </div>

      {loading && categories.length === 0 ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#EAAA08] animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                  <th className="p-4">Tên (Tiếng Việt)</th>
                  <th className="p-4">Tên (Tiếng Anh)</th>
                  <th className="p-4">Đường dẫn URL (Slug)</th>
                  <th className="p-4">Thứ tự</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-700">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-neutral-400 font-bold">
                      Không có danh mục nào.
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.id} className="hover:bg-neutral-50/50 transition">
                      <td className="p-4 font-extrabold text-neutral-900">{category.name_vi}</td>
                      <td className="p-4 font-bold text-neutral-600">{category.name_en}</td>
                      <td className="p-4 text-neutral-500 font-mono">{category.slug}</td>
                      <td className="p-4 text-neutral-900 font-bold">{category.sort_order}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                            category.is_active
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : 'bg-neutral-100 text-neutral-800 border border-neutral-200'
                          }`}
                        >
                          {category.is_active ? 'Hoạt động' : 'Tạm ẩn'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => handleEditClick(category)}
                          className="p-2 hover:bg-neutral-200 rounded-lg text-neutral-500 hover:text-neutral-900 transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
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
          <div className="bg-white border border-neutral-200 p-8 rounded-3xl w-full max-w-md shadow-xl space-y-6">
            <h3 className="text-xl font-black text-neutral-900">
              {editingCategory ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs font-semibold text-neutral-700">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-400 font-black block">Tên danh mục (Tiếng Việt)</label>
                <input
                  type="text"
                  required
                  value={nameVi}
                  onChange={(e) => setNameVi(e.target.value)}
                  className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-400 font-black block">Tên danh mục (Tiếng Anh)</label>
                <input
                  type="text"
                  required
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Đường dẫn URL (Slug)</label>
                  <input
                    type="text"
                    placeholder="vd: banh-mi"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Thứ tự sắp xếp</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2 cursor-pointer font-bold text-neutral-800">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-neutral-300 text-[#EAAA08] focus:ring-[#EAAA08] w-4 h-4"
                  />
                  <span>Kích hoạt danh mục này</span>
                </label>
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
                  Lưu danh mục
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
