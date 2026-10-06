import {
  sendOrderNotificationEmail,
  type NotificationOrder,
  type NotificationOrderItem,
} from './orderNotificationEmail';
import { sendOrderNotificationZalo } from './orderNotificationZalo';

/**
 * Notify the shop about a newly created order on every configured channel (email, Zalo OA).
 * Channels run independently and never throw, so one failing does not block the others.
 */
export async function notifyNewOrder(order: NotificationOrder, items: NotificationOrderItem[]) {
  await Promise.allSettled([
    sendOrderNotificationEmail(order, items),
    sendOrderNotificationZalo(order, items),
  ]);
}
