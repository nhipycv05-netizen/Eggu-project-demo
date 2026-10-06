import { getMailer } from '@/lib/mailer';

export interface NotificationOrderItem {
  product_name_vi: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  options: { name_vi: string; price: number }[];
  note: string | null;
}

export interface NotificationOrder {
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
  created_at?: string;
}

const formatVnd = (value: number) => `${Number(value).toLocaleString('vi-VN')} VND`;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

function buildOrderEmailHtml(order: NotificationOrder, items: NotificationOrderItem[]) {
  const createdAt = new Date(order.created_at || Date.now()).toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
  });
  const discount = Math.max(0, order.subtotal + order.delivery_fee - order.total);

  const itemRows = items
    .map((item) => {
      const options = item.options.length
        ? `<div style="color:#666;font-size:13px">+ ${item.options
            .map((o) => `${escapeHtml(o.name_vi)} (${formatVnd(o.price)})`)
            .join(', ')}</div>`
        : '';
      const note = item.note
        ? `<div style="color:#666;font-size:13px">Ghi chú: ${escapeHtml(item.note)}</div>`
        : '';
      return `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee">
            <strong>${escapeHtml(item.product_name_vi)}</strong>${options}${note}
          </td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatVnd(item.unit_price)}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatVnd(item.subtotal)}</td>
        </tr>`;
    })
    .join('');

  const infoRow = (label: string, value: string) =>
    `<tr><td style="padding:4px 8px;color:#666;width:140px">${label}</td><td style="padding:4px 8px">${value}</td></tr>`;

  return `
  <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#222">
    <h2 style="color:#f59e0b;margin-bottom:4px">EGGU - Đơn hàng mới</h2>
    <p style="margin-top:0">Mã đơn: <strong>${escapeHtml(order.order_number)}</strong> · ${createdAt}</p>

    <h3>Thông tin khách hàng</h3>
    <table style="border-collapse:collapse;width:100%">
      ${infoRow('Họ tên', escapeHtml(order.customer_name))}
      ${infoRow('Số điện thoại', escapeHtml(order.phone))}
      ${order.email ? infoRow('Email', escapeHtml(order.email)) : ''}
      ${infoRow('Địa chỉ', escapeHtml(order.address))}
      ${order.note ? infoRow('Ghi chú', escapeHtml(order.note)) : ''}
      ${infoRow('Thanh toán', escapeHtml(order.payment_method))}
    </table>

    <h3>Chi tiết đơn hàng</h3>
    <table style="border-collapse:collapse;width:100%">
      <thead>
        <tr style="background:#fef3c7">
          <th style="padding:8px;text-align:left">Món</th>
          <th style="padding:8px">SL</th>
          <th style="padding:8px;text-align:right">Đơn giá</th>
          <th style="padding:8px;text-align:right">Thành tiền</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <table style="border-collapse:collapse;width:100%;margin-top:12px">
      ${infoRow('Tạm tính', formatVnd(order.subtotal))}
      ${discount > 0 ? infoRow('Giảm giá', `-${formatVnd(discount)}`) : ''}
      ${infoRow('Phí giao hàng', formatVnd(order.delivery_fee))}
      ${infoRow('<strong>Tổng cộng</strong>', `<strong>${formatVnd(order.total)}</strong>`)}
    </table>
  </div>`;
}

function buildOrderEmailText(order: NotificationOrder, items: NotificationOrderItem[]) {
  const lines = [
    `EGGU - Đơn hàng mới: ${order.order_number}`,
    '',
    `Khách hàng: ${order.customer_name}`,
    `SĐT: ${order.phone}`,
    order.email ? `Email: ${order.email}` : null,
    `Địa chỉ: ${order.address}`,
    order.note ? `Ghi chú: ${order.note}` : null,
    '',
    ...items.map((item) => {
      const options = item.options.length ? ` (+ ${item.options.map((o) => o.name_vi).join(', ')})` : '';
      return `- ${item.quantity} x ${item.product_name_vi}${options}: ${formatVnd(item.subtotal)}`;
    }),
    '',
    `Tổng cộng: ${formatVnd(order.total)} (${order.payment_method})`,
  ];
  return lines.filter((line) => line !== null).join('\n');
}

/**
 * Send a new-order notification to ORDER_NOTIFICATION_EMAIL.
 * Never throws: an email failure must not affect an order that is already saved.
 */
export async function sendOrderNotificationEmail(
  order: NotificationOrder,
  items: NotificationOrderItem[]
) {
  const to = process.env.ORDER_NOTIFICATION_EMAIL;
  const mailer = getMailer();

  if (!mailer || !to) {
    console.warn(
      `[order-email] Skipped for ${order.order_number}: GMAIL_USER, GMAIL_APP_PASSWORD or ORDER_NOTIFICATION_EMAIL is not set`
    );
    return;
  }

  try {
    await mailer.sendMail({
      from: `"EGGU Orders" <${process.env.GMAIL_USER}>`,
      to,
      replyTo: order.email || undefined,
      subject: `[EGGU] Đơn hàng mới ${order.order_number} - ${formatVnd(order.total)}`,
      text: buildOrderEmailText(order, items),
      html: buildOrderEmailHtml(order, items),
    });
    console.info(`[order-email] Sent notification for ${order.order_number}`);
  } catch (error) {
    console.error(`[order-email] Failed to send notification for ${order.order_number}:`, error);
  }
}
