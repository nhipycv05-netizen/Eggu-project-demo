'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Eye, Search, Filter, Loader2, Trash2, AlertTriangle, CheckCircle2, X, Clock } from 'lucide-react';

interface OrderItem {
  id: string;
  product_name_vi: string;
  product_name_en: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  options: { name_vi: string; name_en: string; price: number }[] | null;
  note: string | null;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  note: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  created_at: string;
  items?: OrderItem[];
}

const STATUS_OPTIONS = [
  { value: 'NEW', label: 'Mới', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { value: 'CONFIRMED', label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'PREPARING', label: 'Đang chuẩn bị', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { value: 'DELIVERING', label: 'Đang giao hàng', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { value: 'COMPLETED', label: 'Hoàn thành', color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'CANCELLED', label: 'Đã hủy', color: 'bg-red-100 text-red-800 border-red-200' },
];

export default function OrdersTab() {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const formatOrderTimeTable = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${hours}:${minutes} - ${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  const formatOrderTimeDetail = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${hours}:${minutes}:${seconds} ngày ${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3000);
  };

  // Fetch orders list
  const fetchOrders = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTimeout(() => {
        setOrders(data || []);
        setLoading(false);
      }, 0);
    } catch (err) {
      console.error('Lỗi khi tải danh sách đơn hàng:', err);
      setTimeout(() => setLoading(false), 0);
    }
  }, [supabase]);

  useEffect(() => {
    fetchOrders();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('admin-orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders, supabase]);

  // Update order status
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      // Auto-set payment_status to PAID if order is COMPLETED
      const updates: { order_status: string; payment_status?: string } = { order_status: newStatus };
      if (newStatus === 'COMPLETED') {
        updates.payment_status = 'PAID';
      }

      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId);

      if (error) throw error;

      // Update local state lists
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o))
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, ...updates } : null));
      }
    } catch (err) {
      console.error('Lỗi khi cập trạng thái đơn hàng:', err);
      alert('Cập nhật trạng thái thất bại');
    }
  };

  // Delete order
  const handleDeleteOrder = async (order: Order) => {
    setIsDeleting(true);
    try {
      // Delete associated order_items first for referential safety
      const { error: itemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', order.id);

      if (itemsError) {
        console.warn('Lỗi khi xóa order_items:', itemsError);
      }

      // Delete the order itself
      const { error: orderError } = await supabase
        .from('orders')
        .delete()
        .eq('id', order.id);

      if (orderError) throw orderError;

      // Immediately update local state without reloading whole page
      setOrders((prev) => prev.filter((o) => o.id !== order.id));

      // Reset selected order if the deleted one was selected
      if (selectedOrder?.id === order.id) {
        setSelectedOrder(null);
      }

      setOrderToDelete(null);
      showToast('Đã xóa đơn hàng thành công');
    } catch (err) {
      console.error('Lỗi khi xóa đơn hàng:', err);
      alert('Xóa đơn hàng thất bại. Vui lòng thử lại!');
    } finally {
      setIsDeleting(false);
    }
  };

  // View order items details
  const handleViewOrder = async (order: Order) => {
    setSelectedOrder(order);
    setLoadingDetails(true);
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);

      if (error) throw error;
      setSelectedOrder((prev) => (prev ? { ...prev, items: data || [] } : null));
    } catch (err) {
      console.error('Lỗi khi tải chi tiết món:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Filter & Search Logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm);

    const matchesStatus = statusFilter === 'ALL' || order.order_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 relative">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#1E1B18]">Quản Lý Đơn Hàng</h2>
          <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">
            Theo dõi đơn hàng theo thời gian thực
          </p>
        </div>

        {/* Filters and search inputs */}
        <div className="flex flex-wrap gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Tìm mã đơn, tên khách, SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#EAAA08] bg-white font-medium text-neutral-800 min-w-[240px]"
            />
          </div>

          {/* Status selector */}
          <div className="relative">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#EAAA08] bg-white font-bold text-neutral-700 appearance-none"
            >
              <option value="ALL">Tất cả trạng thái</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#EAAA08] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Orders Table - Left 8 columns */}
          <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                    <th className="p-4">Mã đơn</th>
                    <th className="p-4">Thời gian</th>
                    <th className="p-4">Khách hàng</th>
                    <th className="p-4">Tổng tiền</th>
                    <th className="p-4">Trạng thái</th>
                    <th className="p-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-700">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-neutral-400 font-bold">
                        Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const statusStyle = STATUS_OPTIONS.find((s) => s.value === order.order_status);
                      return (
                        <tr
                          key={order.id}
                          className={`hover:bg-neutral-50/50 transition ${
                            selectedOrder?.id === order.id ? 'bg-neutral-50' : ''
                          }`}
                        >
                          <td className="p-4 font-extrabold text-neutral-900">
                            {order.order_number}
                          </td>
                          <td className="p-4 text-neutral-600 font-medium whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                              <span>{formatOrderTimeTable(order.created_at)}</span>
                            </div>
                          </td>
                          <td className="p-4 space-y-0.5">
                            <p className="font-bold text-neutral-800">{order.customer_name}</p>
                            <p className="text-[10px] text-neutral-400">{order.phone}</p>
                          </td>
                          <td className="p-4 font-bold text-neutral-900">
                            {Number(order.total).toLocaleString()} VND
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${
                                statusStyle?.color || ''
                              }`}
                            >
                              {statusStyle?.label || order.order_status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleViewOrder(order)}
                                className="p-2 hover:bg-neutral-200 rounded-lg text-neutral-500 hover:text-neutral-900 transition"
                                title="Xem chi tiết"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setOrderToDelete(order)}
                                className="p-2 hover:bg-red-50 rounded-lg text-red-500 hover:text-red-700 transition"
                                title="Xóa đơn hàng"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Details Sidebar Panel - Right 4 columns */}
          <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-neutral-500 uppercase tracking-widest border-b border-neutral-200 pb-4">
              Chi Tiết Đơn Hàng
            </h3>

            {selectedOrder ? (
              <div className="space-y-6 text-xs font-semibold text-neutral-700">
                {/* ID Header */}
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-400 uppercase font-black">Mã đơn hàng</span>
                  <p className="text-base font-extrabold text-neutral-900">
                    {selectedOrder.order_number}
                  </p>
                </div>

                {/* Order Time */}
                <div className="space-y-1 border-t border-neutral-100 pt-4">
                  <span className="text-[10px] text-neutral-400 uppercase font-black">Thời gian đặt</span>
                  <div className="flex items-center gap-1.5 text-neutral-800 font-bold">
                    <Clock className="w-3.5 h-3.5 text-[#EAAA08] shrink-0" />
                    <span>{formatOrderTimeDetail(selectedOrder.created_at)}</span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-2 border-t border-neutral-100 pt-4">
                  <span className="text-[10px] text-neutral-400 uppercase font-black">Thông tin khách hàng</span>
                  <p className="text-neutral-900 font-bold">
                    {selectedOrder.customer_name} ({selectedOrder.phone})
                  </p>
                  <p className="text-neutral-500 font-medium leading-relaxed">
                    {selectedOrder.address}
                  </p>
                  {selectedOrder.email && (
                    <p className="text-neutral-500">Email: {selectedOrder.email}</p>
                  )}
                  {selectedOrder.note && (
                    <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-amber-800 italic mt-2">
                      Ghi chú: {selectedOrder.note}
                    </div>
                  )}
                </div>

                {/* Status controller drop-down */}
                <div className="space-y-2 border-t border-neutral-100 pt-4">
                  <span className="text-[10px] text-neutral-400 uppercase font-black">Cập nhật trạng thái</span>
                  <select
                    value={selectedOrder.order_status}
                    onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                    className="w-full p-3 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#EAAA08] bg-white font-bold text-neutral-800"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ordered Items summary list */}
                <div className="space-y-3 border-t border-neutral-100 pt-4">
                  <span className="text-[10px] text-neutral-400 uppercase font-black">Danh sách món</span>
                  {loadingDetails ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="w-5 h-5 text-[#EAAA08] animate-spin" />
                    </div>
                  ) : selectedOrder.items && selectedOrder.items.length > 0 ? (
                    <div className="divide-y divide-neutral-100 max-h-[220px] overflow-y-auto pr-1">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="py-2.5 flex justify-between items-start gap-4">
                          <div>
                            <p className="font-extrabold text-neutral-900">
                              {item.product_name_vi}
                              <span className="text-[10px] text-neutral-400 font-bold ml-1.5">
                                x{item.quantity}
                              </span>
                            </p>
                            {item.options && item.options.length > 0 && (
                              <p className="text-[10px] text-neutral-500 font-medium mt-0.5">
                                + {item.options.map((o) => o.price ? `${o.name_vi} (+${Number(o.price).toLocaleString()} VND)` : o.name_vi).join(', ')}
                              </p>
                            )}
                            {item.note && (
                              <p className="text-[10px] text-amber-600 italic mt-0.5">
                                Ghi chú: &ldquo;{item.note}&rdquo;
                              </p>
                            )}
                          </div>
                          <span className="font-bold text-neutral-900 shrink-0">
                            {Number(item.subtotal).toLocaleString()} VND
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-neutral-400 italic">Không có món nào</p>
                  )}
                </div>

                {/* Pricing summary */}
                <div className="border-t border-neutral-100 pt-4 space-y-1.5 font-bold text-neutral-500">
                  <div className="flex justify-between">
                    <span>Tạm tính</span>
                    <span className="text-neutral-800">
                      {Number(selectedOrder.subtotal).toLocaleString()} VND
                    </span>
                  </div>
                  {Number(selectedOrder.subtotal) - Number(selectedOrder.total) + Number(selectedOrder.delivery_fee) > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Giảm giá (Khuyến mãi)</span>
                      <span>
                        -{(Number(selectedOrder.subtotal) - Number(selectedOrder.total) + Number(selectedOrder.delivery_fee)).toLocaleString()} VND
                      </span>
                    </div>
                  )}
                  {Number(selectedOrder.delivery_fee) > 0 && (
                    <div className="flex justify-between">
                      <span>Phí giao hàng</span>
                      <span className="text-neutral-800">
                        {Number(selectedOrder.delivery_fee).toLocaleString()} VND
                      </span>
                    </div>
                  )}
                  <div className="border-t border-neutral-100 pt-3 flex justify-between items-end">
                    <span className="text-sm font-black text-neutral-900">Tổng thanh toán</span>
                    <span className="text-lg font-black text-[#5C4B3E]">
                      {Number(selectedOrder.total).toLocaleString()} VND
                    </span>
                  </div>
                </div>

                {/* Delete Order Button */}
                <div className="border-t border-neutral-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setOrderToDelete(selectedOrder)}
                    className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-xs active:scale-[0.99]"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Xóa đơn hàng</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-neutral-400 font-bold italic">
                Chọn một đơn hàng trong danh sách để xem chi tiết đầy đủ.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-100 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-neutral-900">
                  Xác nhận xóa đơn hàng
                </h3>
                <p className="text-xs text-neutral-500 font-medium leading-relaxed">
                  Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng <span className="font-bold text-neutral-800">#{orderToDelete.order_number}</span> không? Thao tác này không thể hoàn tác.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setOrderToDelete(null)}
                className="px-4 py-2 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleDeleteOrder(orderToDelete)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa vĩnh viễn</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-neutral-900 text-white px-4 py-3 rounded-xl shadow-lg border border-neutral-700 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-neutral-400 hover:text-white p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
