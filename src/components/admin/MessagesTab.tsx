'use client';

import { useState, useEffect, useCallback } from 'react';
import { ContactMessage, ContactMessageStatus } from '@/types/contact';
import {
  Phone,
  Search,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  MessageSquare,
  RefreshCw,
  X,
  AlertTriangle,
  Send,
  Calendar,
  User,
  ExternalLink,
  Check,
} from 'lucide-react';

const STATUS_CONFIG: Record<
  ContactMessageStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  UNREAD: {
    label: 'Chưa đọc',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
  },
  READ: {
    label: 'Đã đọc',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  REPLIED: {
    label: 'Đã phản hồi',
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
  },
  ARCHIVED: {
    label: 'Đã lưu trữ',
    bg: 'bg-neutral-100',
    text: 'text-neutral-600',
    border: 'border-neutral-200',
  },
};

export default function MessagesTab() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    replied: 0,
    today: 0,
  });

  // Modals
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Note editor in modal
  const [notesInput, setNotesInput] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3000);
  };

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') {
        params.append('status', statusFilter);
      }
      if (searchTerm.trim()) {
        params.append('q', searchTerm.trim());
      }

      const res = await fetch(`/api/contact?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setMessages(data.messages || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách tin nhắn:', err);
      showToast('Không thể tải danh sách tin nhắn!');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const updateMessageStatus = async (
    id: string,
    newStatus: ContactMessageStatus,
    notes?: string
  ) => {
    try {
      const payload: { id: string; status?: ContactMessageStatus; reply_notes?: string } = {
        id,
        status: newStatus,
      };
      if (notes !== undefined) {
        payload.reply_notes = notes;
      }

      const res = await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      // Optimistic update
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                status: newStatus,
                ...(notes !== undefined ? { reply_notes: notes } : {}),
                updated_at: new Date().toISOString(),
              }
            : m
        )
      );

      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage((prev) =>
          prev
            ? {
                ...prev,
                status: newStatus,
                ...(notes !== undefined ? { reply_notes: notes } : {}),
              }
            : null
        );
      }

      // Recalculate local stats
      setStats((prev) => {
        const oldMsg = messages.find((m) => m.id === id);
        if (!oldMsg) return prev;
        let unreadDiff = 0;
        let repliedDiff = 0;
        if (oldMsg.status === 'UNREAD' && newStatus !== 'UNREAD') unreadDiff = -1;
        if (oldMsg.status !== 'UNREAD' && newStatus === 'UNREAD') unreadDiff = 1;
        if (oldMsg.status !== 'REPLIED' && newStatus === 'REPLIED') repliedDiff = 1;
        if (oldMsg.status === 'REPLIED' && newStatus !== 'REPLIED') repliedDiff = -1;

        return {
          ...prev,
          unread: Math.max(0, prev.unread + unreadDiff),
          replied: Math.max(0, prev.replied + repliedDiff),
        };
      });

      showToast(`Đã cập nhật trạng thái thành "${STATUS_CONFIG[newStatus].label}"`);
    } catch (err) {
      console.error('Lỗi khi cập nhật trạng thái:', err);
      showToast('Cập nhật trạng thái thất bại!');
    }
  };

  const handleOpenDetail = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setNotesInput(msg.reply_notes || '');

    // If message is UNREAD, automatically mark as READ
    if (msg.status === 'UNREAD') {
      updateMessageStatus(msg.id, 'READ');
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedMessage) return;
    setSavingNotes(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedMessage.id,
          reply_notes: notesInput,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === selectedMessage.id ? { ...m, reply_notes: notesInput } : m
        )
      );
      setSelectedMessage((prev) => (prev ? { ...prev, reply_notes: notesInput } : null));
      showToast('Đã lưu ghi chú xử lý!');
    } catch {
      showToast('Lỗi khi lưu ghi chú!');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDeleteMessage = async () => {
    if (!messageToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/contact?id=${messageToDelete.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setMessages((prev) => prev.filter((m) => m.id !== messageToDelete.id));
      if (selectedMessage?.id === messageToDelete.id) {
        setSelectedMessage(null);
      }
      setMessageToDelete(null);
      showToast('Đã xóa tin nhắn!');

      // Update stats
      setStats((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
        unread:
          messageToDelete.status === 'UNREAD'
            ? Math.max(0, prev.unread - 1)
            : prev.unread,
      }));
    } catch {
      showToast('Lỗi khi xóa tin nhắn!');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const hours = String(d.getHours()).padStart(2, '0');
      const mins = String(d.getMinutes()).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${hours}:${mins} - ${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E1B18] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-3 text-xs font-bold border border-white/10 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#EAAA08]" />
            <span>Quản Lý Tin Nhắn Liên Hệ</span>
          </h1>
          <p className="text-xs text-neutral-500 font-medium mt-1">
            Xem và xử lý các phản hồi, thắc mắc từ khách hàng gửi qua trang Liên hệ.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-bold text-neutral-700 hover:bg-neutral-50 shadow-xs transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#EAAA08]' : ''}`} />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Tổng tin nhắn
            </span>
            <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-neutral-900 mt-2">{stats.total}</p>
          <p className="text-[11px] text-neutral-400 font-medium mt-1">Tất cả liên hệ đã nhận</p>
        </div>

        {/* Unread */}
        <div
          className={`p-5 rounded-2xl border shadow-xs transition ${
            stats.unread > 0
              ? 'bg-red-50/50 border-red-200'
              : 'bg-white border-neutral-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
              Chưa đọc
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-red-600 mt-2">{stats.unread}</p>
          <p className="text-[11px] text-red-500 font-medium mt-1">Cần xem & phản hồi</p>
        </div>

        {/* Replied */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Đã phản hồi
            </span>
            <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-neutral-900 mt-2">{stats.replied}</p>
          <p className="text-[11px] text-neutral-400 font-medium mt-1">Đã xử lý xong</p>
        </div>

        {/* Today */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Hôm nay
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-[#EAAA08]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-neutral-900 mt-2">{stats.today}</p>
          <p className="text-[11px] text-neutral-400 font-medium mt-1">Tin nhắn trong ngày</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Tìm theo tên, SĐT, nội dung..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#EAAA08]/20 focus:border-[#EAAA08] font-medium"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'ALL', label: 'Tất cả' },
            { id: 'UNREAD', label: 'Chưa đọc', badge: stats.unread },
            { id: 'READ', label: 'Đã đọc' },
            { id: 'REPLIED', label: 'Đã phản hồi' },
            { id: 'ARCHIVED', label: 'Lưu trữ' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-[#1E1B18] text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && tab.badge > 0 ? (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-red-500 text-white font-black">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#EAAA08] animate-spin" />
            <p className="text-xs font-bold text-neutral-400">Đang tải danh sách tin nhắn...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">
              <MessageSquare className="w-7 h-7" />
            </div>
            <p className="text-sm font-bold text-neutral-700">Chưa có tin nhắn nào</p>
            <p className="text-xs text-neutral-400 max-w-sm">
              Khi khách hàng gửi thông tin hoặc yêu cầu qua trang Liên hệ, tin nhắn sẽ hiển thị tại đây.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/50">
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                    Người gửi
                  </th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                    Số điện thoại
                  </th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                    Nội dung
                  </th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                    Trạng thái
                  </th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                    Thời gian
                  </th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-wider text-neutral-400 text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {messages.map((msg) => {
                  const statusConf = STATUS_CONFIG[msg.status] || STATUS_CONFIG.UNREAD;
                  const isUnread = msg.status === 'UNREAD';

                  return (
                    <tr
                      key={msg.id}
                      className={`hover:bg-neutral-50/80 transition ${
                        isUnread ? 'bg-red-50/20 font-semibold' : ''
                      }`}
                    >
                      {/* Name */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                          )}
                          <p className="text-xs font-bold text-neutral-900">{msg.name}</p>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-6">
                        <a
                          href={`tel:${msg.phone.replace(/\s+/g, '')}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E53935] hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5 shrink-0" />
                          <span>{msg.phone}</span>
                        </a>
                      </td>

                      {/* Message Preview */}
                      <td className="py-4 px-6 max-w-xs">
                        <p className="text-xs text-neutral-700 truncate font-medium">
                          {msg.message}
                        </p>
                        {msg.reply_notes && (
                          <p className="text-[10px] text-[#EAAA08] font-bold mt-0.5 truncate">
                            Ghi chú: {msg.reply_notes}
                          </p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusConf.bg} ${statusConf.text} ${statusConf.border}`}
                        >
                          {statusConf.label}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 text-neutral-500 font-medium whitespace-nowrap">
                        {formatDateTime(msg.created_at)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* View Detail */}
                          <button
                            onClick={() => handleOpenDetail(msg)}
                            title="Xem chi tiết"
                            className="p-2 rounded-xl bg-neutral-100 hover:bg-[#1E1B18] text-neutral-600 hover:text-white transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick Toggle Status */}
                          {isUnread ? (
                            <button
                              onClick={() => updateMessageStatus(msg.id, 'READ')}
                              title="Đánh dấu đã đọc"
                              className="p-2 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white transition"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => updateMessageStatus(msg.id, 'UNREAD')}
                              title="Đánh dấu chưa đọc"
                              className="p-2 rounded-xl bg-neutral-100 hover:bg-red-500 text-neutral-500 hover:text-white transition"
                            >
                              <Clock className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => setMessageToDelete(msg)}
                            title="Xóa tin nhắn"
                            className="p-2 rounded-xl bg-neutral-100 hover:bg-red-600 text-neutral-500 hover:text-white transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-neutral-100 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-[#EAAA08]">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-neutral-900">Chi Tiết Tin Nhắn</h3>
                  <p className="text-xs text-neutral-400 font-medium">
                    Gửi vào lúc {formatDateTime(selectedMessage.created_at)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sender Info Card */}
            <div className="bg-neutral-50 p-4 sm:p-5 rounded-2xl border border-neutral-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                {/* Name */}
                <div className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-neutral-200">
                  <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                      Họ và Tên
                    </span>
                    <span className="font-bold text-neutral-900 text-sm truncate block">
                      {selectedMessage.name}
                    </span>
                  </div>
                </div>

                {/* Phone with call action */}
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-neutral-200">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-[#E53935] shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                        Số điện thoại
                      </span>
                      <span className="font-bold text-neutral-900 text-xs truncate block">
                        {selectedMessage.phone}
                      </span>
                    </div>
                  </div>
                  <a
                    href={`tel:${selectedMessage.phone.replace(/\s+/g, '')}`}
                    className="px-2.5 py-1.5 bg-[#E53935] text-white rounded-lg text-xs font-bold hover:bg-[#D32F2F] transition flex items-center gap-1 shadow-xs shrink-0"
                  >
                    <span>Gọi</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Time */}
                <div className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-neutral-200">
                  <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600 shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                      Thời Gian Gửi
                    </span>
                    <span className="font-bold text-neutral-900 text-xs block">
                      {formatDateTime(selectedMessage.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-neutral-900">
                Nội Dung Tin Nhắn
              </label>
              <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-neutral-200 text-sm font-medium text-neutral-800 whitespace-pre-wrap leading-relaxed">
                {selectedMessage.message}
              </div>
            </div>

            {/* Status Switcher */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-neutral-900">
                Trạng Thái Tin Nhắn
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['UNREAD', 'READ', 'REPLIED', 'ARCHIVED'] as ContactMessageStatus[]).map(
                  (st) => {
                    const conf = STATUS_CONFIG[st];
                    const isActive = selectedMessage.status === st;
                    return (
                      <button
                        key={st}
                        onClick={() => updateMessageStatus(selectedMessage.id, st)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition text-center ${
                          isActive
                            ? `${conf.bg} ${conf.text} ${conf.border} ring-2 ring-current`
                            : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                        }`}
                      >
                        {conf.label}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Internal Reply Notes */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-neutral-900">
                Ghi Chú Nội Bộ / Nhật Ký Xử Lý
              </label>
              <textarea
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="Ví dụ: Đã gọi điện lúc 14:30, khách hỏi về combo 10 người và đã chốt đơn..."
                rows={3}
                className="w-full p-3.5 border border-neutral-200 rounded-2xl text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#EAAA08]/20 focus:border-[#EAAA08] resize-none"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="px-4 py-2 bg-[#1E1B18] text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{savingNotes ? 'Đang lưu...' : 'Lưu ghi chú'}</span>
                </button>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
              <button
                onClick={() => {
                  setMessageToDelete(selectedMessage);
                }}
                className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa tin nhắn này</span>
              </button>

              <button
                onClick={() => setSelectedMessage(null)}
                className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {messageToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-6 shadow-2xl border border-neutral-100">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-neutral-900">Xác Nhận Xóa Tin Nhắn</h3>
              <p className="text-xs text-neutral-500 font-medium">
                Bạn có chắc chắn muốn xóa tin nhắn từ khách hàng{' '}
                <strong className="text-neutral-900">{messageToDelete.name}</strong> (
                {messageToDelete.phone})? Thao tác này không thể hoàn tác.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMessageToDelete(null)}
                disabled={isDeleting}
                className="w-full py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl text-xs transition"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleDeleteMessage}
                disabled={isDeleting}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
              >
                {isDeleting ? 'Đang xóa...' : 'Xác Nhận Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
