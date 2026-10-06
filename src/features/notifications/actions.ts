'use server';

import { createClient } from '@/lib/supabase/server';
import { zaloOA, type ZaloSendResult } from '@/lib/zaloOA';

// Admin-friendly explanations for the failures a test send usually hits
const ZALO_TEST_ERROR_HINTS: Record<number, string> = {
  [-201]: 'Zalo từ chối tham số gửi tin, thường do Zalo user ID sai. Kiểm tra lại ID.',
  [-213]: 'Người nhận chưa quan tâm (follow) OA EGGU.',
  [-227]: 'Tài khoản Zalo của người nhận bị khóa hoặc không hoạt động quá 45 ngày.',
  [-230]:
    'Người nhận chưa nhắn tin cho OA trong 7 ngày gần nhất. Nhờ họ nhắn 1 tin bất kỳ cho OA rồi thử lại.',
  [-232]:
    'Người nhận chưa tương tác với OA hoặc tương tác đã quá hạn. Nhờ họ nhắn 1 tin bất kỳ cho OA rồi thử lại.',
  [-244]: 'Người nhận đã chặn loại tin này từ OA.',
};

function describeFailure(result: Extract<ZaloSendResult, { ok: false }>): string {
  if (result.zaloErrorCode !== undefined && ZALO_TEST_ERROR_HINTS[result.zaloErrorCode]) {
    return `${ZALO_TEST_ERROR_HINTS[result.zaloErrorCode]} (mã ${result.zaloErrorCode})`;
  }
  switch (result.reason) {
    case 'invalid_recipient':
      return 'Zalo user ID không hợp lệ (chỉ gồm chữ số).';
    case 'not_configured':
      return 'Chưa cấu hình Zalo OA trên server (token / app secret).';
    case 'timeout':
    case 'network_error':
      return 'Không kết nối được tới Zalo, vui lòng thử lại.';
    default:
      return result.zaloErrorCode !== undefined
        ? `${result.error} (mã ${result.zaloErrorCode})`
        : result.error;
  }
}

/**
 * Send a test Zalo OA message to one notification recipient and record the result.
 * Admin-only: server actions are reachable by anyone, so the session is checked here.
 */
export async function sendTestZaloNotification(
  recipientId: string,
): Promise<{ ok: boolean; message: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.' };
  }

  const { data: recipient, error } = await supabase
    .from('notification_recipients')
    .select('id, name, zalo_user_id')
    .eq('id', recipientId)
    .single();
  if (error || !recipient) {
    return { ok: false, message: 'Không tìm thấy người nhận.' };
  }

  const result = await zaloOA.sendMessage(recipient.zalo_user_id, {
    text: `[EGGU] Tin thử: ${recipient.name} sẽ nhận thông báo đơn hàng mới qua Zalo OA này.`,
  });
  const message = result.ok ? 'Đã gửi tin thử thành công.' : describeFailure(result);

  const { error: updateError } = await supabase
    .from('notification_recipients')
    .update({
      last_test_at: new Date().toISOString(),
      last_test_ok: result.ok,
      last_test_error: result.ok ? null : message,
    })
    .eq('id', recipient.id);
  if (updateError) {
    console.error(`[zalo-test] Failed to save test result: ${updateError.message}`);
  }

  return { ok: result.ok, message };
}
