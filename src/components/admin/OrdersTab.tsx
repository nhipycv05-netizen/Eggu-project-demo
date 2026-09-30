'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Eye, Search, Filter, Loader2, Trash2, AlertTriangle, CheckCircle2, X, Clock, ShoppingBag, XCircle, Archive } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

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

const ACTIVE_STATUS_OPTIONS = [
  { value: 'NEW', label: 'Mới' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'PREPARING', label: 'Đang chuẩn bị' },
  { value: 'DELIVERING', label: 'Đang giao hàng' },
];

const ARCHIVED_STATUS_OPTIONS = [
  { value: 'COMPLETED', label: 'Hoàn thành' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

const isOrderCompleted = (status: string) =>
  status === 'COMPLETED' || status?.toLowerCase() === 'hoàn thành' || status?.toLowerCase() === 'completed';

const isOrderCancelled = (status: string) =>
  status === 'CANCELLED' || status === 'Đã hủy' || status?.toLowerCase() === 'đã hủy' || status?.toLowerCase() === 'cancelled';

const isOrderArchived = (status: string) =>
  isOrderCompleted(status) || isOrderCancelled(status);

const isOrderActive = (status: string) =>
  !isOrderArchived(status);

export const isPickupOrder = (order: Order): boolean => {
  if (!order.address) return false;
  const addr = order.address.toLowerCase();
  return (
    addr.includes('nhận tại') ||
    addr.includes('lấy tại quán') ||
    addr.includes('54 nguyễn hữu huân')
  );
};

export const getOrderPickupTime = (note: string | null): string | null => {
  if (!note) return null;
  const match = note.match(/\[(?:Thời gian nhận|Pickup time):\s*([^\]]+)\]/i);
  return match ? match[1] : null;
};

export const getCleanOrderNote = (note: string | null): string | null => {
  if (!note) return null;
  return (
    note
      .replace(/\[(?:Mã giảm giá|Promo Code):[^\]]+\]\s*/gi, '')
      .replace(/\[(?:Thời gian nhận|Pickup time):[^\]]+\]\s*/gi, '')
      .trim() || null
  );
};

export default function OrdersTab() {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [mainTab, setMainTab] = useState<'ACTIVE' | 'ARCHIVED'>('ACTIVE');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [fulfillmentFilter, setFulfillmentFilter] = useState<'ALL' | 'DELIVERY' | 'PICKUP'>('ALL');
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

      if (newStatus === 'COMPLETED') {
        showToast('Đơn hàng đã hoàn thành và được chuyển vào mục Lưu trữ!');
      } else {
        showToast('Cập nhật trạng thái đơn hàng thành công');
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
    // 1. Tab filter (Đang xử lý vs Lưu trữ)
    const matchesTab =
      mainTab === 'ACTIVE'
        ? isOrderActive(order.order_status)
        : isOrderArchived(order.order_status);

    if (!matchesTab) return false;

    // 2. Status dropdown filter
    let matchesStatus = true;
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'COMPLETED') {
        matchesStatus = isOrderCompleted(order.order_status);
      } else if (statusFilter === 'CANCELLED') {
        matchesStatus = isOrderCancelled(order.order_status);
      } else {
        matchesStatus = order.order_status === statusFilter;
      }
    }

    // 3. Fulfillment method filter
    let matchesFulfillment = true;
    if (fulfillmentFilter === 'PICKUP') {
      matchesFulfillment = isPickupOrder(order);
    } else if (fulfillmentFilter === 'DELIVERY') {
      matchesFulfillment = !isPickupOrder(order);
    }

    // 4. Search query filter
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm);

    return matchesStatus && matchesFulfillment && matchesSearch;
  });

  const tabOrders = orders.filter((o) =>
    mainTab === 'ACTIVE' ? isOrderActive(o.order_status) : isOrderArchived(o.order_status)
  );
  const deliveryOrdersCount = tabOrders.filter((o) => !isPickupOrder(o)).length;
  const pickupOrdersCount = tabOrders.filter((o) => isPickupOrder(o)).length;

  const activeOrdersCount = orders.filter((o) => isOrderActive(o.order_status)).length;
  const archivedOrdersCount = orders.filter((o) => isOrderArchived(o.order_status)).length;

  // Calculate statistics from all orders
  const stats = {
    total: orders.length,
    new: orders.filter(
      (o) =>
        o.order_status === 'NEW' ||
        o.order_status?.toLowerCase() === 'mới' ||
        o.order_status?.toLowerCase() === 'new'
    ).length,
    completed: orders.filter((o) => isOrderCompleted(o.order_status)).length,
    today: orders.filter((o) => {
      if (!o.created_at) return false;
      try {
        const d = new Date(o.created_at);
        if (isNaN(d.getTime())) return false;
        const now = new Date();
        return (
          d.getDate() === now.getDate() &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      } catch {
        return false;
      }
    }).length,
    cancelled: orders.filter((o) => isOrderCancelled(o.order_status)).length,
  };

  return (
    <div className="space-y-6 relative">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#1E1B18]">Quản Lý Đơn Hàng</h2>
          <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">
            Theo dõi đơn hàng theo thời gian thực
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Card 1: Tổng đơn hàng */}
        <div
          onClick={() => {
            setMainTab('ACTIVE');
            setStatusFilter('ALL');
          }}
          className={`p-5 rounded-2xl border shadow-xs transition cursor-pointer ${
            mainTab === 'ACTIVE' && statusFilter === 'ALL'
              ? 'bg-neutral-50/80 border-neutral-300 ring-2 ring-neutral-800'
              : 'bg-white border-neutral-200 hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              TỔNG ĐƠN HÀNG
            </span>
            <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-neutral-900 mt-2">{stats.total}</p>
          <p className="text-[11px] text-neutral-400 font-medium mt-1">Tất cả đơn trong hệ thống</p>
        </div>

        {/* Card 2: Đơn mới / Chờ xác nhận */}
        <div
          onClick={() => {
            setMainTab('ACTIVE');
            setStatusFilter('NEW');
          }}
          className={`p-5 rounded-2xl border shadow-xs transition cursor-pointer ${
            mainTab === 'ACTIVE' && statusFilter === 'NEW'
              ? 'bg-red-50/40 border-red-300 ring-2 ring-red-500'
              : stats.new > 0
              ? 'bg-red-50/20 border-red-200 hover:border-red-300'
              : 'bg-white border-neutral-200 hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
              ĐƠN MỚI
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-red-600 mt-2">{stats.new}</p>
          <p className="text-[11px] text-red-500 font-medium mt-1">Cần xác nhận & xử lý</p>
        </div>

        {/* Card 3: Hoàn thành (Bấm chuyển sang Lưu trữ) */}
        <div
          onClick={() => {
            setMainTab('ARCHIVED');
            setStatusFilter('COMPLETED');
          }}
          className={`p-5 rounded-2xl border shadow-xs transition cursor-pointer ${
            mainTab === 'ARCHIVED' && (statusFilter === 'COMPLETED' || statusFilter === 'ALL')
              ? 'bg-green-50/40 border-green-300 ring-2 ring-green-600'
              : 'bg-white border-neutral-200 hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              HOÀN THÀNH
            </span>
            <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-neutral-900 mt-2">{stats.completed}</p>
          <p className="text-[11px] text-neutral-400 font-medium mt-1">Đơn đã giao thành công (Bấm để xem)</p>
        </div>

        {/* Card 4: Hôm nay */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              HÔM NAY
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-[#EAAA08]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-neutral-900 mt-2">{stats.today}</p>
          <p className="text-[11px] text-neutral-400 font-medium mt-1">Đơn phát sinh trong ngày</p>
        </div>

        {/* Card 5: Đã hủy */}
        <div
          onClick={() => {
            setMainTab('ARCHIVED');
            setStatusFilter('CANCELLED');
          }}
          className={`p-5 rounded-2xl border shadow-xs transition cursor-pointer col-span-2 sm:col-span-1 ${
            mainTab === 'ARCHIVED' && statusFilter === 'CANCELLED'
              ? 'bg-neutral-100 border-neutral-300 ring-2 ring-neutral-600'
              : 'bg-white border-neutral-200 hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              ĐÃ HỦY
            </span>
            <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-500">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-neutral-900 mt-2">{stats.cancelled}</p>
          <p className="text-[11px] text-neutral-400 font-medium mt-1">Đơn bị hủy bỏ</p>
        </div>
      </div>

      {/* Navigation Tabs & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Tab Switcher: Đang xử lý vs Lưu trữ */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl border border-neutral-200 self-start">
          <button
            type="button"
            onClick={() => {
              setMainTab('ACTIVE');
              setStatusFilter('ALL');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              mainTab === 'ACTIVE'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#EAAA08]" />
            <span>Đang xử lý</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                mainTab === 'ACTIVE'
                  ? stats.new > 0
                    ? 'bg-red-500 text-white'
                    : 'bg-neutral-900 text-white'
                  : 'bg-neutral-200 text-neutral-600'
              }`}
            >
              {activeOrdersCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMainTab('ARCHIVED');
              setStatusFilter('ALL');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              mainTab === 'ARCHIVED'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Archive className="w-3.5 h-3.5 text-neutral-500" />
            <span>Lưu trữ</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                mainTab === 'ARCHIVED'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-200 text-neutral-600'
              }`}
            >
              {archivedOrdersCount}
            </span>
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Tìm mã đơn, tên khách, SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#EAAA08]/20 focus:border-[#EAAA08] bg-white font-medium text-neutral-800"
            />
          </div>

          {/* Status selector */}
          <div className="relative">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto pl-10 pr-8 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#EAAA08]/20 focus:border-[#EAAA08] bg-white font-bold text-neutral-700 appearance-none cursor-pointer"
            >
              <option value="ALL">
                {mainTab === 'ACTIVE'
                  ? `Tất cả trạng thái (${activeOrdersCount})`
                  : `Tất cả trạng thái (${archivedOrdersCount})`}
              </option>
              {(mainTab === 'ACTIVE' ? ACTIVE_STATUS_OPTIONS : ARCHIVED_STATUS_OPTIONS).map(
                (opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Fulfillment method selector */}
          <div className="relative">
            <select
              value={fulfillmentFilter}
              onChange={(e) => setFulfillmentFilter(e.target.value as 'ALL' | 'DELIVERY' | 'PICKUP')}
              className="w-full sm:w-auto px-3 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#EAAA08]/20 focus:border-[#EAAA08] bg-white font-bold text-neutral-700 cursor-pointer"
            >
              <option value="ALL">Tất cả hình thức ({tabOrders.length})</option>
              <option value="DELIVERY">🛵 Giao hàng ({deliveryOrdersCount})</option>
              <option value="PICKUP">🏪 Lấy tại quán ({pickupOrdersCount})</option>
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
                      <td colSpan={6} className="p-12 text-center text-neutral-400 font-bold">
                        {mainTab === 'ACTIVE'
                          ? 'Hiện không có đơn hàng nào đang cần xử lý.'
                          : 'Chưa có đơn hàng nào trong mục lưu trữ.'}
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
                          <td className="p-4 space-y-1.5">
                            <div className="font-extrabold text-neutral-900">
                              {order.order_number}
                            </div>
                            {isPickupOrder(order) ? (
                              <div className="flex flex-col gap-1 items-start">
                                <span className="bg-amber-100 text-amber-800 text-[11px] font-semibold px-2 py-0.5 rounded inline-flex items-center gap-1 border border-amber-200/60">
                                  <span>🏪</span>
                                  <span>Lấy tại quán</span>
                                </span>
                                {getOrderPickupTime(order.note) && (
                                  <span className="text-[10px] font-black text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 inline-flex items-center gap-1">
                                    <span>⏰</span>
                                    <span>{getOrderPickupTime(order.note)}</span>
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="bg-blue-100 text-blue-800 text-[11px] font-semibold px-2 py-0.5 rounded inline-flex items-center gap-1 border border-blue-200/60">
                                <span>🛵</span>
                                <span>Giao hàng</span>
                              </span>
                            )}
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
                            {formatPrice(order.total)} VND
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
                  {selectedOrder.email && (
                    <p className="text-neutral-500 text-xs">Email: {selectedOrder.email}</p>
                  )}
                </div>

                {/* Fulfillment Method / Hình thức nhận hàng */}
                <div className="space-y-2 border-t border-neutral-100 pt-4">
                  <span className="text-[10px] text-neutral-400 uppercase font-black">
                    Hình thức nhận hàng
                  </span>
                  {isPickupOrder(selectedOrder) ? (
                    <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl space-y-2">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900">
                        <span>🏪</span>
                        <span>Lấy tại quán</span>
                        <span className="ml-auto text-[10px] font-bold bg-amber-200/70 text-amber-800 px-2 py-0.5 rounded">
                          Pickup
                        </span>
                      </div>

                      {/* Prominent Pickup Time Display */}
                      <div className="flex items-center justify-between text-xs font-bold bg-white px-3 py-2 rounded-lg border border-amber-200/80 shadow-2xs">
                        <span className="text-neutral-500 font-semibold text-[11px]">Thời gian nhận:</span>
                        <span className="text-amber-950 font-black flex items-center gap-1">
                          <span>⏰</span>
                          <span>{getOrderPickupTime(selectedOrder.note) || 'Lấy ngay (10-15 phút)'}</span>
                        </span>
                      </div>

                      <p className="text-[11px] text-amber-800 font-medium">
                        Khách nhận tại EGGU - 54 Nguyễn Hữu Huân
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-blue-50/90 border border-blue-200 rounded-xl space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-blue-900">
                        <span>🛵</span>
                        <span>Giao hàng tận nơi</span>
                        <span className="ml-auto text-[10px] font-bold bg-blue-200/70 text-blue-800 px-2 py-0.5 rounded">
                          Delivery
                        </span>
                      </div>
                      <p className="text-[11px] text-blue-800 font-medium leading-relaxed">
                        Địa chỉ: <span className="font-bold">{selectedOrder.address}</span>
                      </p>
                    </div>
                  )}
                  {getCleanOrderNote(selectedOrder.note) && (
                    <div className="bg-amber-50/60 border border-amber-200/70 p-2.5 rounded-lg text-amber-800 italic mt-2">
                      Ghi chú: {getCleanOrderNote(selectedOrder.note)}
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
                                + {item.options.map((o) => o.price ? `${o.name_vi} (+${formatPrice(o.price)} VND)` : o.name_vi).join(', ')}
                              </p>
                            )}
                            {item.note && (
                              <p className="text-[10px] text-amber-600 italic mt-0.5">
                                Ghi chú: &ldquo;{item.note}&rdquo;
                              </p>
                            )}
                          </div>
                          <span className="font-bold text-neutral-900 shrink-0">
                            {formatPrice(item.subtotal)} VND
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
                      {formatPrice(selectedOrder.subtotal)} VND
                    </span>
                  </div>
                  {Number(selectedOrder.subtotal) - Number(selectedOrder.total) + Number(selectedOrder.delivery_fee) > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Giảm giá (Khuyến mãi)</span>
                      <span>
                        -{formatPrice(Number(selectedOrder.subtotal) - Number(selectedOrder.total) + Number(selectedOrder.delivery_fee))} VND
                      </span>
                    </div>
                  )}
                  {Number(selectedOrder.delivery_fee) > 0 && (
                    <div className="flex justify-between">
                      <span>Phí giao hàng</span>
                      <span className="text-neutral-800">
                        {formatPrice(selectedOrder.delivery_fee)} VND
                      </span>
                    </div>
                  )}
                  <div className="border-t border-neutral-100 pt-3 flex justify-between items-end">
                    <span className="text-sm font-black text-neutral-900">Tổng thanh toán</span>
                    <span className="text-lg font-black text-[#5C4B3E]">
                      {formatPrice(selectedOrder.total)} VND
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
