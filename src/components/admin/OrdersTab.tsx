'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Eye, Search, Filter, Loader2 } from 'lucide-react';

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
  { value: 'NEW', label: 'New', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { value: 'CONFIRMED', label: 'Confirmed', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'PREPARING', label: 'Preparing', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { value: 'DELIVERING', label: 'Delivering', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { value: 'COMPLETED', label: 'Completed', color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200' },
];

export default function OrdersTab() {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

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
      console.error('Error fetching orders:', err);
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
      console.error('Error updating order status:', err);
      alert('Failed to update status');
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
      console.error('Error fetching order items:', err);
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
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#1E1B18]">Order Tracking</h2>
          <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">
            Real-time live monitoring
          </p>
        </div>

        {/* Filters and search inputs */}
        <div className="flex flex-wrap gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search order, customer, phone..."
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
              <option value="ALL">All Statuses</option>
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
                    <th className="p-4">Order #</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-700">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-neutral-400 font-bold">
                        No orders matching current filter.
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
                              {order.order_status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleViewOrder(order)}
                              className="p-2 hover:bg-neutral-200 rounded-lg text-neutral-500 hover:text-neutral-900 transition"
                            >
                              <Eye className="w-4 h-4" />
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

          {/* Details Sidebar Panel - Right 4 columns */}
          <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-neutral-500 uppercase tracking-widest border-b border-neutral-200 pb-4">
              Order Details
            </h3>

            {selectedOrder ? (
              <div className="space-y-6 text-xs font-semibold text-neutral-700">
                {/* ID Header */}
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-400 uppercase font-black">Tracking Number</span>
                  <p className="text-base font-extrabold text-neutral-900">
                    {selectedOrder.order_number}
                  </p>
                </div>

                {/* Customer Info */}
                <div className="space-y-2 border-t border-neutral-100 pt-4">
                  <span className="text-[10px] text-neutral-400 uppercase font-black">Customer Contacts</span>
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
                  <span className="text-[10px] text-neutral-400 uppercase font-black">Change Status</span>
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
                  <span className="text-[10px] text-neutral-400 uppercase font-black">Items List</span>
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
                                + {item.options.map((o) => o.name_vi).join(', ')}
                              </p>
                            )}
                            {item.note && (
                              <p className="text-[10px] text-amber-600 italic mt-0.5">
                                Note: &ldquo;{item.note}&rdquo;
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
                    <p className="text-neutral-400 italic">No items found</p>
                  )}
                </div>

                {/* Pricing summary */}
                <div className="border-t border-neutral-100 pt-4 space-y-1.5 font-bold text-neutral-500">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-neutral-800">
                      {Number(selectedOrder.subtotal).toLocaleString()} VND
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="text-neutral-800">
                      {Number(selectedOrder.delivery_fee).toLocaleString()} VND
                    </span>
                  </div>
                  <div className="border-t border-neutral-100 pt-3 flex justify-between items-end">
                    <span className="text-sm font-black text-neutral-900">Total</span>
                    <span className="text-lg font-black text-[#5C4B3E]">
                      {Number(selectedOrder.total).toLocaleString()} VND
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-neutral-400 font-bold italic">
                Select an order from the list to view its complete details.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
