import { isZaloOAConfigured, zaloOA, ZALO_TEXT_MAX_LENGTH } from '@/lib/zaloOA';
import { formatPrice } from '@/lib/utils';
import { createServiceRoleClient } from '@/lib/supabase/serviceRole';
import type { NotificationOrder, NotificationOrderItem } from './orderNotificationEmail';

const formatVnd = (value: number) => `${formatPrice(value)} VND`;

function envRecipients(): string[] {
  return [process.env.ZALO_ORDER_NOTIFICATION_USER_IDS, process.env.ZALO_ADMIN_USER_ID]
    .flatMap((value) => (value || '').split(','))
    .map((id) => id.trim())
    .filter(Boolean);
}

/**
 * Recipients of new-order Zalo notifications (admin, owner, staff, delivery partner, ...),
 * managed in Admin > Người nhận thông báo (table notification_recipients, active rows only).
 * Falls back to ZALO_ORDER_NOTIFICATION_USER_IDS / ZALO_ADMIN_USER_ID only when the table
 * is empty or cannot be read, so a database problem does not silence the admin.
 */
export async function getOrderNotificationZaloRecipients(): Promise<string[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from('notification_recipients')
    .select('zalo_user_id, is_active');

  let ids: string[];
  if (error || !data || data.length === 0) {
    if (error) {
      console.error(`[order-zalo] Failed to load notification_recipients: ${error.message}`);
    }
    ids = envRecipients();
  } else {
    ids = data.filter((r) => r.is_active).map((r) => String(r.zalo_user_id).trim());
  }
  return [...new Set(ids.filter(Boolean))];
}

function buildOrderZaloText(order: NotificationOrder, items: NotificationOrderItem[]) {
  const createdAt = new Date(order.created_at || Date.now()).toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
  });
  const discount = Math.max(0, order.subtotal + order.delivery_fee - order.total);

  const header = [
    `🥪 EGGU - Đơn hàng mới ${order.order_number}`,
    createdAt,
    '',
    `Khách: ${order.customer_name}`,
    `SĐT: ${order.phone}`,
    `Địa chỉ: ${order.address}`,
    order.note ? `Ghi chú: ${order.note}` : null,
    '',
  ];
  const footer = [
    '',
    discount > 0 ? `Giảm giá: -${formatVnd(discount)}` : null,
    `Tổng cộng: ${formatVnd(order.total)} (${order.payment_method})`,
  ];
  const itemLines = items.map((item) => {
    const options = item.options.length
      ? ` (+ ${item.options.map((o) => o.name_vi).join(', ')})`
      : '';
    const note = item.note ? ` [${item.note}]` : '';
    return `- ${item.quantity} x ${item.product_name_vi}${options}${note}: ${formatVnd(item.subtotal)}`;
  });

  const join = (lines: (string | null)[]) => lines.filter((line) => line !== null).join('\n');

  // Zalo text messages are capped at 2.000 characters: drop trailing items if needed.
  let text = join([...header, ...itemLines, ...footer]);
  for (
    let shown = itemLines.length - 1;
    text.length > ZALO_TEXT_MAX_LENGTH && shown >= 0;
    shown--
  ) {
    const more = `... và ${itemLines.length - shown} món khác`;
    text = join([...header, ...itemLines.slice(0, shown), more, ...footer]);
  }
  return text.slice(0, ZALO_TEXT_MAX_LENGTH);
}

/**
 * Send a new-order notification to the configured Zalo recipients via the EGGU OA.
 * Never throws: a Zalo failure must not affect an order that is already saved.
 */
export async function sendOrderNotificationZalo(
  order: NotificationOrder,
  items: NotificationOrderItem[],
) {
  if (!isZaloOAConfigured()) {
    console.warn(
      `[order-zalo] Skipped for ${order.order_number}: Zalo OA credentials (ZALO_OA_ACCESS_TOKEN / ZALO_OA_REFRESH_TOKEN) are not set`,
    );
    return;
  }

  try {
    const recipients = await getOrderNotificationZaloRecipients();
    if (recipients.length === 0) {
      console.warn(
        `[order-zalo] Skipped for ${order.order_number}: no active recipient (Admin > Người nhận thông báo)`,
      );
      return;
    }

    const result = await zaloOA.sendToMany(recipients, { text: buildOrderZaloText(order, items) });
    console.info(
      `[order-zalo] ${order.order_number}: sent ${result.sent}/${result.results.length}, failed ${result.failed}`,
    );
  } catch (error) {
    console.error(`[order-zalo] Failed to send notification for ${order.order_number}:`, error);
  }
}
