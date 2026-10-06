'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { sendTestZaloNotification } from '@/features/notifications/actions';
import { Plus, Edit2, Trash2, Loader2, Send, Info } from 'lucide-react';

interface NotificationRecipient {
  id: string;
  name: string;
  role: string;
  zalo_user_id: string;
  is_active: boolean;
  note: string | null;
  last_test_at: string | null;
  last_test_ok: boolean | null;
  last_test_error: string | null;
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'Quản trị viên',
  owner: 'Chủ cửa hàng',
  staff: 'Nhân viên',
  delivery: 'Giao hàng',
  other: 'Khác',
};

const ZALO_USER_ID_PATTERN = /^\d{1,32}$/;

export default function NotificationRecipientsTab() {
  const supabase = createClient();
  const [recipients, setRecipients] = useState<NotificationRecipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRecipient, setEditingRecipient] = useState<NotificationRecipient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testFeedback, setTestFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('staff');
  const [zaloUserId, setZaloUserId] = useState('');
  const [note, setNote] = useState('');
  const [isActive, setIsActive] = useState(true);

  const fetchRecipients = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('notification_recipients')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setTimeout(() => {
        setRecipients(data || []);
        setLoading(false);
      }, 0);
    } catch (err) {
      console.error('Lỗi khi tải danh sách người nhận thông báo:', err);
      setTimeout(() => setLoading(false), 0);
    }
  }, [supabase]);

  useEffect(() => {
    fetchRecipients();
  }, [fetchRecipients]);

  const handleEditClick = (recipient: NotificationRecipient) => {
    setEditingRecipient(recipient);
    setName(recipient.name);
    setRole(recipient.role);
    setZaloUserId(recipient.zalo_user_id);
    setNote(recipient.note || '');
    setIsActive(recipient.is_active);
    setIsModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingRecipient(null);
    setName('');
    setRole('staff');
    setZaloUserId('');
    setNote('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleSaveRecipient = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanZaloUserId = zaloUserId.trim();
    if (!ZALO_USER_ID_PATTERN.test(cleanZaloUserId)) {
      alert('Zalo user ID chỉ gồm chữ số');
      return;
    }

    setLoading(true);
    const payload = {
      name: name.trim(),
      role,
      zalo_user_id: cleanZaloUserId,
      note: note.trim() || null,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingRecipient) {
        const { error } = await supabase
          .from('notification_recipients')
          .update(payload)
          .eq('id', editingRecipient.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('notification_recipients').insert(payload);
        if (error) throw error;
      }

      setIsModalOpen(false);
      await fetchRecipients();
    } catch (err) {
      console.error('Lỗi khi lưu người nhận thông báo:', err);
      const isDuplicate = (err as { code?: string })?.code === '23505';
      alert(isDuplicate ? 'Zalo user ID này đã có trong danh sách' : 'Lưu người nhận thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (recipient: NotificationRecipient) => {
    try {
      const { error } = await supabase
        .from('notification_recipients')
        .update({ is_active: !recipient.is_active, updated_at: new Date().toISOString() })
        .eq('id', recipient.id);
      if (error) throw error;
      await fetchRecipients();
    } catch (err) {
      console.error('Lỗi khi cập nhật trạng thái người nhận:', err);
      alert('Cập nhật trạng thái thất bại');
    }
  };

  const handleDeleteRecipient = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người nhận này không?')) return;
    setLoading(true);

    try {
      const { error } = await supabase.from('notification_recipients').delete().eq('id', id);
      if (error) throw error;
      await fetchRecipients();
    } catch (err) {
      console.error('Lỗi khi xóa người nhận:', err);
      alert('Xóa người nhận thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleSendTest = async (recipient: NotificationRecipient) => {
    setTestingId(recipient.id);
    setTestFeedback(null);
    try {
      const result = await sendTestZaloNotification(recipient.id);
      setTestFeedback({ ok: result.ok, message: `${recipient.name}: ${result.message}` });
      await fetchRecipients();
    } catch (err) {
      console.error('Lỗi khi gửi tin thử:', err);
      setTestFeedback({ ok: false, message: `${recipient.name}: Gửi tin thử thất bại` });
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#1E1B18]">Người Nhận Thông Báo</h2>
          <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">
            Danh sách nhận tin Zalo OA khi có đơn hàng mới
          </p>
        </div>

        <button
          onClick={handleAddNewClick}
          className="px-4 py-2 bg-[#EAAA08] text-[#1E1B18] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#EAAA08]/90 transition flex items-center space-x-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4 stroke-[3px]" />
          <span>Thêm Người Nhận</span>
        </button>
      </div>

      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-semibold text-amber-900">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          Zalo chỉ cho OA gửi tin tới người đã <strong>nhắn tin cho OA trong 7 ngày gần nhất</strong>.
          Mỗi người nhận nên nhắn cho OA EGGU ít nhất 1 lần/tuần. Dùng nút{' '}
          <strong>Gửi thử</strong> để kiểm tra ID đúng và người nhận còn nhận được tin.
        </p>
      </div>

      {testFeedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold ${
            testFeedback.ok
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {testFeedback.message}
        </div>
      )}

      {loading && recipients.length === 0 ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#EAAA08] animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                  <th className="p-4">Tên</th>
                  <th className="p-4">Vai trò</th>
                  <th className="p-4">Zalo user ID</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4">Lần thử gần nhất</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-700">
                {recipients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-neutral-400 font-bold">
                      Chưa có người nhận thông báo nào.
                    </td>
                  </tr>
                ) : (
                  recipients.map((recipient) => (
                    <tr key={recipient.id} className="hover:bg-neutral-50/50 transition">
                      <td className="p-4">
                        <div className="font-extrabold text-neutral-900">{recipient.name}</div>
                        {recipient.note && (
                          <div className="text-[11px] text-neutral-400 font-medium max-w-xs truncate">
                            {recipient.note}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-neutral-500 font-bold">
                        {ROLE_LABELS[recipient.role] || recipient.role}
                      </td>
                      <td className="p-4 font-mono text-neutral-700">{recipient.zalo_user_id}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleActive(recipient)}
                          title="Bấm để bật/tắt nhận thông báo"
                          className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider transition ${
                            recipient.is_active
                              ? 'bg-green-100 text-green-800 border border-green-200 hover:bg-green-200'
                              : 'bg-neutral-100 text-neutral-800 border border-neutral-200 hover:bg-neutral-200'
                          }`}
                        >
                          {recipient.is_active ? 'Đang nhận' : 'Tạm tắt'}
                        </button>
                      </td>
                      <td className="p-4">
                        {recipient.last_test_at ? (
                          <div className="space-y-0.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                recipient.last_test_ok
                                  ? 'bg-green-100 text-green-800 border border-green-200'
                                  : 'bg-red-100 text-red-700 border border-red-200'
                              }`}
                            >
                              {recipient.last_test_ok ? 'Thành công' : 'Thất bại'}
                            </span>
                            <div className="text-[11px] text-neutral-400 font-medium">
                              {new Date(recipient.last_test_at).toLocaleString('vi-VN')}
                            </div>
                            {!recipient.last_test_ok && recipient.last_test_error && (
                              <div className="text-[11px] text-red-600 font-medium max-w-xs">
                                {recipient.last_test_error}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-neutral-400">Chưa thử</span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => handleSendTest(recipient)}
                          disabled={testingId !== null}
                          title="Gửi tin thử qua Zalo OA"
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider text-[#1E1B18] bg-[#EAAA08]/15 hover:bg-[#EAAA08]/30 transition disabled:opacity-50"
                        >
                          {testingId === recipient.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Send className="w-3.5 h-3.5" />
                          )}
                          <span>Gửi thử</span>
                        </button>
                        <button
                          onClick={() => handleEditClick(recipient)}
                          className="p-2 hover:bg-neutral-200 rounded-lg text-neutral-500 hover:text-neutral-900 transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRecipient(recipient.id)}
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
          <div className="bg-white border border-neutral-200 p-8 rounded-3xl w-full max-w-lg shadow-xl max-h-[85vh] overflow-y-auto space-y-6">
            <h3 className="text-xl font-black text-neutral-900">
              {editingRecipient ? 'Chỉnh Sửa Người Nhận' : 'Thêm Người Nhận Mới'}
            </h3>

            <form onSubmit={handleSaveRecipient} className="space-y-4 text-xs font-semibold text-neutral-700">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Tên</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="VD: Chị Lan - quản lý ca sáng"
                    className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Vai trò</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-3 border border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-[#EAAA08] font-bold"
                  >
                    {Object.entries(ROLE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-400 font-black block">Zalo user ID</label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={zaloUserId}
                  onChange={(e) => setZaloUserId(e.target.value)}
                  placeholder="VD: 4055972888995015783"
                  className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08] font-mono"
                />
                <p className="text-[11px] text-neutral-400 font-medium">
                  ID của người dùng theo OA EGGU (chỉ gồm chữ số), không phải số điện thoại.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-400 font-black block">Ghi chú</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08] resize-none"
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
                  <span>Nhận thông báo đơn hàng mới</span>
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
                  Lưu người nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
