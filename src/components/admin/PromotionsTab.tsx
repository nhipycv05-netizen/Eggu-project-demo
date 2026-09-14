'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Edit2, Trash2, Loader2, Tag, Percent } from 'lucide-react';
import { Promotion } from '@/types/promotion';
import { parsePromotionFromDb, serializePromotionForDb } from '@/lib/promotions';

export default function PromotionsTab() {
  const supabase = createClient();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [code, setCode] = useState('');
  const [descriptionVi, setDescriptionVi] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState(10);
  const [minOrderValue, setMinOrderValue] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isActive, setIsActive] = useState(true);

  const fetchPromotions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const parsed = (data || []).map((row) => parsePromotionFromDb(row));
      setPromotions(parsed);
      setLoading(false);
    } catch (err) {
      console.error('Lỗi khi tải danh sách khuyến mãi:', err);
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handleEditClick = (promo: Promotion) => {
    setEditingPromo(promo);
    setCode(promo.code);
    setDescriptionVi(promo.description_vi);
    setDescriptionEn(promo.description_en);
    setDiscountType(promo.discount_type);
    setDiscountValue(Number(promo.discount_value));
    setMinOrderValue(promo.min_order_value ? Number(promo.min_order_value) : 0);
    setStartDate(new Date(promo.start_at).toISOString().split('T')[0]);
    setEndDate(new Date(promo.end_at).toISOString().split('T')[0]);
    setIsActive(promo.is_active);
    setIsModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingPromo(null);
    setCode('');
    setDescriptionVi('');
    setDescriptionEn('');
    setDiscountType('PERCENTAGE');
    setDiscountValue(10);
    setMinOrderValue(0);
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(nextMonth);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = serializePromotionForDb({
      code,
      description_vi: descriptionVi,
      description_en: descriptionEn,
      discount_type: discountType,
      discount_value: discountValue,
      min_order_value: minOrderValue > 0 ? minOrderValue : null,
      start_date: startDate,
      end_date: endDate,
      is_active: isActive,
    });

    try {
      if (editingPromo) {
        const { error } = await supabase
          .from('promotions')
          .update(payload)
          .eq('id', editingPromo.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('promotions').insert(payload);
        if (error) throw error;
      }

      setIsModalOpen(false);
      await fetchPromotions();
    } catch (err) {
      console.error('Lỗi khi lưu thông tin khuyến mãi:', err);
      alert('Lưu mã khuyến mãi thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePromo = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa mã khuyến mãi này không?')) return;
    setLoading(true);

    try {
      const { error } = await supabase.from('promotions').delete().eq('id', id);
      if (error) throw error;
      await fetchPromotions();
    } catch (err) {
      console.error('Lỗi khi xóa mã khuyến mãi:', err);
      alert('Xóa mã khuyến mãi thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#1E1B18]">Quản Lý Khuyến Mãi & Giảm Giá</h2>
          <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">
            Quản lý mã giảm giá, tỷ lệ chiết khấu và thời gian áp dụng
          </p>
        </div>

        <button
          onClick={handleAddNewClick}
          className="px-4 py-2 bg-[#EAAA08] text-[#1E1B18] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#EAAA08]/90 transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3px]" />
          <span>Thêm Mã Khuyến Mãi</span>
        </button>
      </div>

      {loading && promotions.length === 0 ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#EAAA08] animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                  <th className="p-4">Mã khuyến mãi</th>
                  <th className="p-4">Mô tả</th>
                  <th className="p-4">Mức giảm</th>
                  <th className="p-4">Đơn tối thiểu</th>
                  <th className="p-4">Thời gian áp dụng</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-700">
                {promotions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-neutral-400 font-bold">
                      Không có mã khuyến mãi nào.
                    </td>
                  </tr>
                ) : (
                  promotions.map((promo) => (
                    <tr key={promo.id} className="hover:bg-neutral-50/50 transition">
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Tag className="w-3.5 h-3.5 text-[#EAAA08]" />
                          <span className="font-extrabold text-neutral-900 font-mono tracking-wider">
                            {promo.code}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-neutral-600 max-w-xs truncate">
                        {promo.description_vi || promo.title_vi || '-'}
                      </td>
                      <td className="p-4 font-bold text-neutral-800">
                        {promo.discount_type === 'PERCENTAGE'
                          ? `${promo.discount_value}%`
                          : `${Number(promo.discount_value).toLocaleString('vi-VN')} VND`}
                      </td>
                      <td className="p-4 text-neutral-500">
                        {promo.min_order_value && promo.min_order_value > 0
                          ? `${Number(promo.min_order_value).toLocaleString('vi-VN')} VND`
                          : 'Không yêu cầu'}
                      </td>
                      <td className="p-4 text-neutral-500 font-medium">
                        {new Date(promo.start_at).toLocaleDateString('vi-VN')} -{' '}
                        {new Date(promo.end_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                            promo.is_active
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : 'bg-neutral-100 text-neutral-800 border border-neutral-200'
                          }`}
                        >
                          {promo.is_active ? 'Hoạt động' : 'Tạm ngừng'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => handleEditClick(promo)}
                          className="p-2 hover:bg-neutral-200 rounded-lg text-neutral-500 hover:text-neutral-900 transition cursor-pointer"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePromo(promo.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-neutral-400 hover:text-red-600 transition cursor-pointer"
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
        <div className="fixed inset-0 bg-[#1E1B18]/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white border border-neutral-200 p-8 rounded-3xl w-full max-w-lg shadow-xl max-h-[85vh] overflow-y-auto space-y-6">
            <h3 className="text-xl font-black text-neutral-900">
              {editingPromo ? 'Chỉnh Sửa Mã Khuyến Mãi' : 'Thêm Mã Khuyến Mãi Mới'}
            </h3>

            <form onSubmit={handleSavePromo} className="space-y-4 text-xs font-semibold text-neutral-700">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Mã khuyến mãi (Code)</label>
                  <input
                    type="text"
                    required
                    placeholder="vd: EGGU20"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08] font-bold font-mono uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Loại giảm giá</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'PERCENTAGE' | 'FIXED')}
                    className="w-full p-3 border border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-[#EAAA08] font-bold"
                  >
                    <option value="PERCENTAGE">Phần trăm (%)</option>
                    <option value="FIXED">Số tiền cố định (VNĐ)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">
                    {discountType === 'PERCENTAGE' ? 'Giá trị giảm (%)' : 'Giá trị giảm (VNĐ)'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Đơn hàng tối thiểu (VNĐ)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0 nếu không yêu cầu"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(Number(e.target.value))}
                    className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Ngày bắt đầu</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Ngày kết thúc</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-400 font-black block">Mô tả (Tiếng Việt)</label>
                <input
                  type="text"
                  required
                  placeholder="vd: Giảm 20% cho đơn hàng từ 100.000 VNĐ"
                  value={descriptionVi}
                  onChange={(e) => setDescriptionVi(e.target.value)}
                  className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-400 font-black block">Mô tả (Tiếng Anh)</label>
                <input
                  type="text"
                  required
                  placeholder="vd: 20% off for orders from 100,000 VND"
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2 cursor-pointer font-bold text-neutral-800">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-neutral-300 text-[#EAAA08] focus:ring-[#EAAA08] w-4 h-4"
                  />
                  <span>Kích hoạt mã khuyến mãi này</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-neutral-200 text-neutral-700 font-bold uppercase rounded-xl hover:bg-neutral-50 transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#EAAA08] text-[#1E1B18] font-bold uppercase rounded-xl hover:bg-[#EAAA08]/90 transition cursor-pointer"
                >
                  Lưu mã khuyến mãi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
