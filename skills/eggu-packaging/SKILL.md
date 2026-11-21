---
name: eggu-packaging
description: "Quy chuẩn thiết kế và kỹ thuật chỉnh sửa bao bì sản phẩm EGGU (Sandwich Trứng Hàn Quốc) cho ảnh AI thiết kế. Hướng dẫn chi tiết về cấu trúc hộp, artwork logo, linh vật Bite the Boom, dải màu vàng chân hộp, họa tiết doodle và quy tắc cấm tuyệt đối logo thương hiệu cạnh tranh (Egg Drop)."
metadata:
  version: 1.1.0
---

# Quy Chuẩn Bao Bì Sản Phẩm EGGU Cho Ảnh AI Thiết Kế

Kỹ năng này định nghĩa bộ quy tắc chuẩn mực (Standard Operating Procedure) nhằm đảm bảo tất cả hình ảnh concept do AI thiết kế (ảnh bên phải của bài viết Marketing) luôn thể hiện **100% bao bì chính thức của thương hiệu EGGU**, loại bỏ hoàn toàn các lỗi sai bao bì hoặc lẫn thương hiệu cạnh tranh nước ngoài.

---

## 1. Cấu Trúc Nhận Diện Bao Bì Chuẩn Của EGGU

Thương hiệu **EGGU - Sandwich Trứng Hàn Quốc** có 2 loại bao bì chuẩn:

### Loại 1: Hộp Giấy Cầm Tay / Khay Ăn Tại Quán & Dạo Phố (Handheld Serving Box)
* **Hình thức**: Khay hộp giấy chữ nhật mở nắp trên, sandwich bánh mì bơ tỏi kẹp trứng cuộn trồi lên trên.
* **Chất liệu nền**: Giấy bìa cứng màu trắng sáng / trắng kem mịn (`#FFFFFF` – `#F8F9FA`).
* **Dải chân hộp**: Dải viền vàng tươi (`#F59E0B` đến `#FBBF24`), chiếm khoảng 20% - 25% chiều cao đáy hộp, có đường viền chỉ mảnh phía trên.
* **Mặt trước hộp**:
  * **Linh vật chính**: Nhân vật Bánh mì nướng ôm Trứng ốp la cười tươi, phía trên uốn cong dòng chữ *"Bite the Boom"* (hoặc *"Bite into goodness"*).
  * **Logo chữ**: Chữ **Eggu** (hoặc in hoa **EGGU**) màu đỏ tươi thương hiệu (`#E11D48` / `#DC2626`) đặt phía dưới linh vật.
  * **Họa tiết nền (Doodles)**: Họa tiết vẽ nét mảnh (line-art) mờ màu vàng cam/xám nhạt các món ăn (trứng ốp la, cốc cà phê, bánh sừng bò, burger) rải đều trên nền trắng.

### Loại 2: Hộp Mang Về Có Nắp Gập (Takeaway Delivery Box)
* **Hình thức**: Hộp giấy màu trắng gập kín nắp che bánh mang đi ship.
* **Mặt trước nắp**:
  * Chữ **EGGU** in hoa to, đậm nét, màu đỏ (`#E11D48`).
  * Phụ đề ngay dưới: **Sandwich Trứng Hàn Quốc** màu vàng cam (`#D97706`).
  * Linh vật **Bite the Boom** (bánh mì ôm trứng ốp la) đặt ngay bên dưới phụ đề.

---

## 2. Mẫu Bánh Chuẩn Của Tiệm (Master Reference Standard)

Mẫu ảnh bánh chuẩn đã được phê duyệt và áp dụng làm chuẩn mực duy nhất cho toàn bộ hệ thống "ẢNH AI THIẾT KẾ":
* **File lưu trữ**: `public/images/eggu-master-ai-concept.jpg`
* **URL Supabase Storage**: `https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/ai-concept-eggu-official.jpg`
* **Đặc điểm**:
  * Bánh sandwich cầm tay bơ tỏi vàng rụm, trứng cuộn fluffy mềm mượt, phô mai tan chảy, thịt xông khói áp chảo.
  * Hộp giấy trắng in đầy đủ mascot EGGU, logo đỏ, dải viền vàng đáy hộp và họa tiết doodle.
  * Bối cảnh phố cổ Hà Nội (Phố Lý Quốc Sư) chụp tự nhiên dưới ánh nắng ban ngày.

---

## 3. Quy Tắc Cấm Tuyệt Đối (Strict Negative Constraints)

1. **Tuyệt đối KHÔNG có thương hiệu "EGG DROP"**:
   * Khi tạo prompt sinh ảnh bằng AI (Midjourney, Flux, Ideogram, Gemini), **không bao giờ** dùng cụm từ *"Korean egg drop sandwich"* vì các mô hình AI sẽ tự động sinh chữ "EGG DROP" của chuỗi nhà hàng Hàn Quốc lên hộp giấy và biển hiệu xung quanh.
   * Luôn dùng cụm từ: *"Korean-style brioche egg sandwich in a clean, blank white paper takeout box with yellow bottom accent"*.
   * Kiểm tra toàn cảnh bức ảnh: hộp bánh, cốc giấy, khăn ăn (napkin) và biển hiệu cửa hàng phía sau, đảm bảo sạch sẽ 100% không dính chữ "EGG DROP" hay "ISAAC TOAST".
2. **Không để logo bay lơ lửng trên thức ăn**:
   * Logo và nhãn hiệu phải nằm **chính xác trên bề mặt hộp giấy**, tuyệt đối không dán đè lên phần ruột bánh mì, phô mai tan chảy hay trứng cuộn.
3. **Đúng góc phối cảnh 3D (Perspective & Lighting)**:
   * Mặt hộp trong ảnh chụp luôn có góc nghiêng 3D. Artwork EGGU phải được xoay, nghiêng và gọt viền (clip) chuẩn theo góc nghiêng của hộp.

---

## 4. Quy Trình Chỉnh Sửa & Xử Lý Kỹ Thuật (Pipeline)

Khi xử lý một bức ảnh AI để gắn bao bì chuẩn của tiệm:
1. **Xác định 4 đỉnh mặt phẳng hộp (Quad coordinates)**:
   * `Top-Left`, `Top-Right`, `Bottom-Right`, `Bottom-Left`.
2. **Che sạch bề mặt cũ**:
   * Sử dụng gradient màu giấy trắng tự nhiên theo ánh sáng môi trường của ảnh để phủ sạch logo cũ, chữ cũ.
3. **Vẽ dải vàng chân hộp**:
   * Phủ dải màu vàng chuẩn EGGU theo đúng đường xiên của cạnh đáy.
4. **Áp dụng Clip Path**:
   * Toàn bộ phần vẽ bao bì và logo phải được bao bọc trong `<clipPath>` theo 4 đỉnh của hộp để không bị lem sang viền bánh mì hoặc mặt bàn.
5. **Dọn sạch chi tiết ngoại cảnh**:
   * Tẩy xóa logo đối thủ trên khăn giấy hoặc biển hiệu hậu cảnh.
