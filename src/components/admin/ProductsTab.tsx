'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon, Upload } from 'lucide-react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

interface Product {
  id: string;
  category_id: string;
  name_vi: string;
  name_en: string;
  slug: string;
  description_vi: string;
  description_en: string;
  price: number;
  image_url: string | null;
  is_active: boolean;
  is_available?: boolean;
  is_new: boolean;
  is_best_seller: boolean;
  sort_order: number;
}

interface Category {
  id: string;
  name_vi: string;
  name_en: string;
}

export default function ProductsTab() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [categoryId, setCategoryId] = useState('');
  const [nameVi, setNameVi] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');
  const [descriptionVi, setDescriptionVi] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isNewFlag, setIsNewFlag] = useState(false);
  const [isBestSellerFlag, setIsBestSellerFlag] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);

  const fetchProductsAndCategories = useCallback(async () => {
    try {
      const { data: catData } = await supabase
        .from('categories')
        .select('id, name_vi, name_en')
        .order('sort_order', { ascending: true });
      
      const { data: prodData } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true });

      setTimeout(() => {
        setCategories(catData || []);
        setProducts(prodData || []);
        setLoading(false);
      }, 0);
    } catch (err) {
      console.error('Lỗi khi tải thông tin sản phẩm và danh mục:', err);
      setTimeout(() => setLoading(false), 0);
    }
  }, [supabase]);

  useEffect(() => {
    fetchProductsAndCategories();
  }, [fetchProductsAndCategories]);

  // Set form values on edit start
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setCategoryId(product.category_id);
    setNameVi(product.name_vi);
    setNameEn(product.name_en);
    setSlug(product.slug);
    setDescriptionVi(product.description_vi);
    setDescriptionEn(product.description_en);
    setPrice(Number(product.price));
    setImageUrl(product.image_url || '');
    setIsActive(product.is_active);
    setIsAvailable(product.is_available !== false);
    setIsNewFlag(product.is_new);
    setIsBestSellerFlag(product.is_best_seller);
    setSortOrder(product.sort_order);
    setIsModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingProduct(null);
    setCategoryId(categories[0]?.id || '');
    setNameVi('');
    setNameEn('');
    setSlug('');
    setDescriptionVi('');
    setDescriptionEn('');
    setPrice(0);
    setImageUrl('');
    setIsActive(true);
    setIsAvailable(true);
    setIsNewFlag(false);
    setIsBestSellerFlag(false);
    setSortOrder(0);
    setIsModalOpen(true);
  };

  // Handle image upload to Supabase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh hợp lệ');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      setImageUrl(data.publicUrl);
    } catch (err: unknown) {
      console.error('Lỗi khi tải ảnh lên Supabase Storage:', err);
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      alert(`Tải ảnh lên thất bại: ${errorMessage}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Handle Save
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const productPayload = {
      category_id: categoryId,
      name_vi: nameVi,
      name_en: nameEn,
      slug: slug || nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      description_vi: descriptionVi,
      description_en: descriptionEn,
      price: Number(price),
      image_url: imageUrl || null,
      is_active: isActive,
      is_available: isAvailable,
      is_new: isNewFlag,
      is_best_seller: isBestSellerFlag,
      sort_order: Number(sortOrder),
    };

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productPayload)
          .eq('id', editingProduct.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productPayload);

        if (error) throw error;
      }

      setIsModalOpen(false);
      await fetchProductsAndCategories();
    } catch (err) {
      console.error('Lỗi khi lưu sản phẩm:', err);
      alert('Lưu thông tin sản phẩm thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Toggle active status directly
  const handleToggleActive = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !product.is_active })
        .eq('id', product.id);

      if (error) throw error;

      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_active: !p.is_active } : p))
      );
    } catch (err) {
      console.error('Lỗi khi thay đổi trạng thái:', err);
    }
  };

  // Toggle available status directly
  const handleToggleAvailable = async (product: Product) => {
    const nextVal = product.is_available === false ? true : false;
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_available: nextVal })
        .eq('id', product.id);

      if (error) throw error;

      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_available: nextVal } : p))
      );
    } catch (err: unknown) {
      console.error('Lỗi khi thay đổi trạng thái còn hàng:', err);
      const errObj = err as { code?: string; message?: string };
      if (errObj?.code === '42703' || errObj?.message?.includes('is_available')) {
        alert(
          'Chưa có cột "is_available" trong bảng products.\nVui lòng chạy file migration "supabase/migrations/20260822000002_add_is_available_to_products.sql" trong Supabase SQL Editor.'
        );
      } else {
        alert(`Không thể thay đổi trạng thái còn hàng: ${errObj?.message || 'Lỗi không xác định'}`);
      }
    }
  };

  // Handle delete
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) return;
    setLoading(true);

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      await fetchProductsAndCategories();
    } catch (err) {
      console.error('Lỗi khi xóa sản phẩm:', err);
      alert('Xóa sản phẩm thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#1E1B18]">Danh Mục Sản Phẩm</h2>
          <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">
            Quản lý các món ăn và thông tin chi tiết sản phẩm
          </p>
        </div>

        <button
          onClick={handleAddNewClick}
          className="px-4 py-2 bg-[#EAAA08] text-[#1E1B18] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#EAAA08]/90 transition flex items-center space-x-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4 stroke-[3px]" />
          <span>Thêm Sản Phẩm Mới</span>
        </button>
      </div>

      {loading && products.length === 0 ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#EAAA08] animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                  <th className="p-4">Món ăn</th>
                  <th className="p-4">Danh mục</th>
                  <th className="p-4">Giá bán</th>
                  <th className="p-4">Hiển thị</th>
                  <th className="p-4">Còn hàng</th>
                  <th className="p-4">Huy hiệu</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-700">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-neutral-400 font-bold">
                      Không có sản phẩm nào.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const cat = categories.find((c) => c.id === product.category_id);
                    return (
                      <tr key={product.id} className="hover:bg-neutral-50/50 transition">
                        <td className="p-4 flex items-center space-x-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-neutral-200 shrink-0 bg-neutral-50 flex items-center justify-center">
                            {product.image_url ? (
                              <Image
                                src={product.image_url}
                                alt={product.name_en}
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-neutral-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-extrabold text-neutral-900">{product.name_vi}</p>
                            <p className="text-[10px] text-neutral-400">{product.name_en}</p>
                          </div>
                        </td>
                        <td className="p-4 text-neutral-500 font-medium">
                          {cat ? cat.name_vi : 'Chưa phân loại'}
                        </td>
                        <td className="p-4 font-bold text-neutral-900">
                          {formatPrice(product.price)} VND
                        </td>
                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(product)}
                            title={product.is_active ? 'Đang hiển thị' : 'Đang ẩn'}
                            className={`w-10 h-6 rounded-full p-0.5 transition duration-200 focus:outline-none ${
                              product.is_active ? 'bg-green-500' : 'bg-neutral-200'
                            }`}
                          >
                            <div
                              className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition duration-200 ${
                                product.is_active ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleToggleAvailable(product)}
                              title={product.is_available !== false ? 'Còn món' : 'Hết món'}
                              className={`w-10 h-6 rounded-full p-0.5 transition duration-200 focus:outline-none ${
                                product.is_available !== false ? 'bg-green-500' : 'bg-neutral-300'
                              }`}
                            >
                              <div
                                className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition duration-200 ${
                                  product.is_available !== false ? 'translate-x-4' : 'translate-x-0'
                                }`}
                              />
                            </button>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                product.is_available !== false
                                  ? 'bg-green-50 text-green-700 border border-green-200'
                                  : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
                              }`}
                            >
                              {product.is_available !== false ? 'Còn món' : 'Hết món'}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 space-x-1.5 shrink-0">
                          {product.is_new && (
                            <span className="bg-[#5C4B3E]/10 text-[#5C4B3E] font-bold text-[9px] px-2 py-0.5 rounded-full">
                              MỚI
                            </span>
                          )}
                          {product.is_best_seller && (
                            <span className="bg-[#EAAA08]/15 text-[#EAAA08] font-bold text-[9px] px-2 py-0.5 rounded-full">
                              BÁN CHẠY
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-1">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="p-2 hover:bg-neutral-200 rounded-lg text-neutral-500 hover:text-neutral-900 transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 hover:bg-red-50 rounded-lg text-neutral-400 hover:text-red-600 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1E1B18]/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white border border-neutral-200 p-8 rounded-3xl w-full max-w-2xl shadow-xl max-h-[85vh] overflow-y-auto space-y-6">
            <h3 className="text-xl font-black text-neutral-900">
              {editingProduct ? 'Chỉnh Sửa Thông Tin Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-semibold text-neutral-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category Selection */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Danh mục</label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full p-3 border border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-[#EAAA08] font-bold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name_vi} / {c.name_en}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Giá bán (VNĐ)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name VI */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Tên món (Tiếng Việt)</label>
                  <input
                    type="text"
                    required
                    value={nameVi}
                    onChange={(e) => setNameVi(e.target.value)}
                    className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                  />
                </div>

                {/* Name EN */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Tên món (Tiếng Anh)</label>
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Slug */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Đường dẫn URL (Slug - Không bắt buộc)</label>
                  <input
                    type="text"
                    placeholder="vd: banh-mi-trung-pho-mai"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                  />
                </div>

                {/* Sort Order */}
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

              {/* Description VI */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-400 font-black block">Mô tả (Tiếng Việt)</label>
                <textarea
                  value={descriptionVi}
                  onChange={(e) => setDescriptionVi(e.target.value)}
                  rows={2}
                  className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08] resize-none"
                />
              </div>

              {/* Description EN */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-400 font-black block">Mô tả (Tiếng Anh)</label>
                <textarea
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  rows={2}
                  className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08] resize-none"
                />
              </div>

              {/* Product Image Upload */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-neutral-400 font-black block">Hình ảnh sản phẩm</label>
                <div className="flex items-center gap-3">
                  <label className={`inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl hover:border-[#EAAA08] hover:bg-neutral-100 transition cursor-pointer text-xs font-bold text-neutral-700 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#EAAA08]" />
                    ) : (
                      <Upload className="w-4 h-4 text-neutral-500" />
                    )}
                    <span>{uploading ? 'Đang tải ảnh lên Supabase...' : 'Chọn file ảnh từ máy tính'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  {imageUrl && !uploading && (
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1 transition"
                    >
                      Xóa ảnh
                    </button>
                  )}
                </div>

                {/* Preview Box */}
                {imageUrl && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] uppercase text-neutral-400 font-bold block">Xem trước:</span>
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-50">
                      <Image
                        src={imageUrl}
                        alt="Xem trước ảnh sản phẩm"
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Switches */}
              <div className="flex flex-wrap gap-6 pt-2 font-bold text-xs text-neutral-800">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-neutral-300 text-[#EAAA08] focus:ring-[#EAAA08] w-4 h-4"
                  />
                  <span>Hiển thị sản phẩm</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="rounded border-neutral-300 text-green-600 focus:ring-green-500 w-4 h-4"
                  />
                  <span className={isAvailable ? 'text-green-700 font-bold' : 'text-neutral-500'}>
                    {isAvailable ? 'Còn hàng (Trong kho)' : 'Hết món (Tạm hết)'}
                  </span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNewFlag}
                    onChange={(e) => setIsNewFlag(e.target.checked)}
                    className="rounded border-neutral-300 text-[#EAAA08] focus:ring-[#EAAA08] w-4 h-4"
                  />
                  <span>Huy hiệu Món mới (NEW)</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestSellerFlag}
                    onChange={(e) => setIsBestSellerFlag(e.target.checked)}
                    className="rounded border-neutral-300 text-[#EAAA08] focus:ring-[#EAAA08] w-4 h-4"
                  />
                  <span>Huy hiệu Bán chạy (BEST SELLER)</span>
                </label>
              </div>

              {/* Modal Buttons */}
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
                  disabled={loading || uploading}
                  className="flex-1 py-3 bg-[#EAAA08] text-[#1E1B18] font-bold uppercase rounded-xl hover:bg-[#EAAA08]/90 transition disabled:opacity-50"
                >
                  {loading ? 'Đang lưu...' : 'Lưu sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
