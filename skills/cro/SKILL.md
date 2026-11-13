---
name: cro
description: Conversion Rate Optimization strategies for food ordering, mobile form UX, autofill, and frictionless checkout.
---

# Skill: Conversion Rate Optimization (Tối Ưu Tỷ Lệ Chốt Đơn F&B)

Bộ kỹ năng này tập trung vào việc giảm thiểu rào cản và loại bỏ tỷ lệ bỏ dở giỏ hàng (Cart Abandonment) trên website đặt món trực tuyến của **EGGU**.

## 1. Tối Ưu Bàn Phím Di Động (Mobile-First Form UX)
* **Quy tắc bắt buộc:** Với các trường nhập số (đặc biệt là Số Điện Thoại), luôn chỉ định:
  ```html
  <input type="tel" inputmode="tel" autocomplete="tel" />
  ```
* **Lợi ích:** Kích hoạt ngay bàn phím số to rõ trên iOS & Android, tránh việc khách phải chuyển qua chuyển lại bàn phím chữ, giảm 80% tỷ lệ nhập sai số điện thoại.

## 2. Hỗ Trợ Tự Động Điền 1-Chạm (Browser Autofill)
* Khách hàng đặt đồ ăn vội vã trong giờ làm việc rất ngại gõ tay từng ký tự.
* Luôn khai báo đầy đủ các thuộc tính chuẩn:
  * Họ tên: `autocomplete="name"`
  * Số điện thoại: `autocomplete="tel"`
  * Địa chỉ: `autocomplete="street-address"`
  * Email: `autocomplete="email"`
* Khách chỉ cần chạm 1 lần vào gợi ý của trình duyệt để điền toàn bộ form trong chưa đầy 3 giây.

## 3. Giải Tỏa E Ngại Trường Không Bắt Buộc
* Khách đặt bánh mì ăn sáng/trưa không muốn bị hỏi email.
* Nếu có trường Email, bắt buộc phải ghi rõ: *"Địa Chỉ Email (Không bắt buộc)"* kèm placeholder: *"Không bắt buộc (để nhận hóa đơn qua email)"*.

## 4. Tín Hiệu An Tâm Ngay Dưới Nút Đặt Hàng (Trust Signals)
* Khoảnh khắc trước khi bấm `"Đặt Hàng Ngay"`, khách hàng thường nảy sinh tâm lý do dự.
* Đặt 2 cam kết nhẹ nhàng ngay dưới nút CTA:
  * ✓ *Thanh toán linh hoạt COD / Chuyển khoản*
  * ✓ *Bánh nướng nóng hổi sau khi chốt*

