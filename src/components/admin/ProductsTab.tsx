'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

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
      console.error('Error fetching catalog details:', err);
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
    setImageUrl('/images/hero-sandwich.jpg');
    setIsActive(true);
    setIsNewFlag(false);
    setIsBestSellerFlag(false);
    setSortOrder(0);
    setIsModalOpen(true);
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
      console.error('Error saving product:', err);
      alert('Failed to save product details');
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
      console.error('Error toggling status:', err);
    }
  };

  // Handle delete
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setLoading(true);

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      await fetchProductsAndCategories();
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#1E1B18]">Products Catalog</h2>
          <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">
            Manage your food items and metadata
          </p>
        </div>

        <button
          onClick={handleAddNewClick}
          className="px-4 py-2 bg-[#EAAA08] text-[#1E1B18] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#EAAA08]/90 transition flex items-center space-x-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4 stroke-[3px]" />
          <span>Add New Product</span>
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
                  <th className="p-4">Item</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Active</th>
                  <th className="p-4">Badges</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-700">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-neutral-400 font-bold">
                      No products found.
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
                            <p className="font-extrabold text-neutral-900">{product.name_en}</p>
                            <p className="text-[10px] text-neutral-400">{product.name_vi}</p>
                          </div>
                        </td>
                        <td className="p-4 text-neutral-500 font-medium">
                          {cat ? cat.name_en : 'Unassigned'}
                        </td>
                        <td className="p-4 font-bold text-neutral-900">
                          {Number(product.price).toLocaleString()} VND
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleActive(product)}
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
                        <td className="p-4 space-x-1.5 shrink-0">
                          {product.is_new && (
                            <span className="bg-[#5C4B3E]/10 text-[#5C4B3E] font-bold text-[9px] px-2 py-0.5 rounded-full">
                              NEW
                            </span>
                          )}
                          {product.is_best_seller && (
                            <span className="bg-[#EAAA08]/15 text-[#EAAA08] font-bold text-[9px] px-2 py-0.5 rounded-full">
                              BEST
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
              {editingProduct ? 'Edit Product Details' : 'Create New Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-semibold text-neutral-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category Selection */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Category</label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full p-3 border border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-[#EAAA08] font-bold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name_en} / {c.name_vi}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Price (VND)</label>
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
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Name (VI)</label>
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
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Name (EN)</label>
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
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">URL Slug (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. mr-egg"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                  />
                </div>

                {/* Sort Order */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Sort Order</label>
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
                <label className="text-[10px] uppercase text-neutral-400 font-black block">Description (VI)</label>
                <textarea
                  value={descriptionVi}
                  onChange={(e) => setDescriptionVi(e.target.value)}
                  rows={2}
                  className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08] resize-none"
                />
              </div>

              {/* Description EN */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-400 font-black block">Description (EN)</label>
                <textarea
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  rows={2}
                  className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08] resize-none"
                />
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-400 font-black block">Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                />
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
                  <span>Active Item</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNewFlag}
                    onChange={(e) => setIsNewFlag(e.target.checked)}
                    className="rounded border-neutral-300 text-[#EAAA08] focus:ring-[#EAAA08] w-4 h-4"
                  />
                  <span>New Product Badge</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestSellerFlag}
                    onChange={(e) => setIsBestSellerFlag(e.target.checked)}
                    className="rounded border-neutral-300 text-[#EAAA08] focus:ring-[#EAAA08] w-4 h-4"
                  />
                  <span>Best Seller Badge</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-neutral-200 text-neutral-700 font-bold uppercase rounded-xl hover:bg-neutral-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#EAAA08] text-[#1E1B18] font-bold uppercase rounded-xl hover:bg-[#EAAA08]/90 transition"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
