---
name: seo-and-ai-search
description: Local SEO and AI Answer Engine Optimization (AEO) for food businesses, structured JSON-LD schemas, and Google Maps ranking.
---

# Skill: Local SEO & AI Answer Engine Optimization (AEO)

Bộ kỹ năng này hướng dẫn cách tối ưu hóa công cụ tìm kiếm địa phương (Google Search, Google Maps) và các trợ lý ảo AI (ChatGPT Search, Perplexity, Gemini) cho **EGGU**.

## 1. Xây Dựng Local SEO Hub (Định Vị Phố Cổ & Hoàn Kiếm)
* **Nguyên tắc:** Google và AI đánh giá cao các địa điểm ẩm thực có chỉ dẫn bối cảnh xung quanh (Semantic Neighborhood Context).
* **Nội dung cần có trên trang Cửa hàng & Liên hệ:**
  * **Vị trí cụ thể:** Nằm trên con phố cà phê trứng Nguyễn Hữu Huân nổi tiếng, cách Hồ Gươm & Phố Đi Bộ chỉ 300m.
  * **Tiện ích phương tiện:** Có chỗ dừng đỗ xe máy thuận tiện ngay trước tiệm để ghé mua mang đi (Takeaway).
  * **Bán kính phục vụ:** Nhận ship nhanh bánh nóng giòn từ 15-30 phút tới các cơ quan, văn phòng quận Hoàn Kiếm & Hai Bà Trưng.

## 2. Đồng Bộ NAP & Cấu Trúc Schema LocalBusiness
* **NAP (Name - Address - Phone) nhất quán:**
  * Name: `Eggu - Sandwich Trứng Hàn Quốc`
  * Address: `54 Nguyễn Hữu Huân, Hoàn Kiếm, Hà Nội`
  * Phone: `0356779899`
* **Nhúng Schema JSON-LD Restaurant:**
  * Khai báo chính xác tọa độ GPS: `latitude: 21.0336, longitude: 105.8545`.
  * Khai báo giờ mở cửa: `07:00` đến `21:00` mỗi ngày.
  * Khai báo liên kết mạng xã hội chính thức (Facebook, TikTok, Zalo).

## 3. Cấu Trúc Dữ Liệu Cho Trợ Lý Ảo AI (Menu & MenuItem Schema)
* Các trợ lý AI (ChatGPT, Perplexity) quét dữ liệu có cấu trúc `schema.org/Menu` trên trang `/menu` để trích xuất trực tiếp:
  * Tên món ăn (`name`)
  * Mô tả hương vị (`description`)
  * Giá tiền (`offers.price`, `priceCurrency: "VND"`)
  * Trạng thái sẵn sàng phục vụ (`availability: "https://schema.org/InStock"`)
* Nhờ đó, khi khách hàng hỏi AI: *"Gợi ý quán bánh mì trứng ngon gần phố cổ kèm menu và giá tiền"*, AI sẽ ưu tiên trích dẫn và hiển thị chính xác thương hiệu EGGU.

