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

## 3. Bộ 8 Bố Cục Thiết Kế Độc Quyền Theo Từng Bài Viết (Layout Compositions)

Để tránh việc tất cả bài viết dùng chung 1 khung hình lặp lại, mỗi bài viết marketing được thiết kế một **bố cục (layout) & góc chụp (angle)** riêng biệt phù hợp theo từng loại bánh và câu chuyện của caption:

1. **Bố cục 1: Hanoi Street Walk Signature (Phố Lý Quốc Sư)**
   * *Món*: Mr. Egg (39.000đ)
   * *File*: `ai-concept-mr-egg-street.jpg`
   * *Bố cục*: Góc chụp cầm tay kinh điển trước kiến trúc phố cổ Hà Nội, badge nhận diện thương hiệu sang trọng, tông vàng nắng mai chuẩn vị Seoul.
2. **Bố cục 2: Walking Street Dual Sandwich Tray (Khay gỗ phố đi bộ)**
   * *Món*: Sandwich Thịt Hộp, Phô Mai & Nori (60.000đ)
   * *File*: `ai-concept-spam-nori-tray.jpg`
   * *Bố cục*: Khay gỗ đôi 2 chiếc bánh phủ sốt rong biển xanh & phô mai kéo sợi giữa phố đi bộ Hoàn Kiếm, badge nhóm bạn gom đơn ca cứng.
3. **Bố cục 3: Macro Gourmet Close-Up (Cận cảnh bắp ngô & phô mai)**
   * *Món*: Sandwich Thịt Xông Khói Ngô Phô Mai (50.000đ)
   * *File*: `ai-concept-corn-bacon-macro.jpg`
   * *Bố cục*: Zoom cận cảnh 1:1 làm nổi bật từng hạt ngô vàng ươm, lớp phô mai cheddar tan chảy óng ả và thịt xông khói áp chảo.
4. **Bố cục 4: Sweet Warm French Toast Morning Glow (Caramel bơ sữa)**
   * *Món*: Sandwich Nướng Kiểu Pháp (55.000đ)
   * *File*: `ai-concept-french-toast-warm.jpg`
   * *Bố cục*: Ánh sáng ấm áp tone mật ong hổ phách, tôn vinh độ ngọt dịu béo ngậy của bánh mì bơ tỏi nướng sốt caramel.
5. **Bố cục 5: Best Seller Dynamic 3D Sizzle (Góc chéo bơ tỏi bùng nổ)**
   * *Món*: Sandwich Thịt Xông Khói Bơ Tỏi Phô Mai (55.000đ)
   * *File*: `ai-concept-bacon-garlic-bestseller.jpg`
   * *Bố cục*: Góc chéo tương phản cao làm nổi bật vỏ brioche vàng ruộm và các dải thịt xông khói giòn rụm với huy hiệu Best Seller.
6. **Bố cục 6: Modern Office Commute Card (Bữa sáng công sở)**
   * *Món*: Sandwich Thịt Xông Khói Bơ Tỏi Phô Mai (55.000đ)
   * *File*: `ai-concept-office-morning-rush.jpg`
   * *Bố cục*: Khung card xanh slate hiện đại nhấn mạnh tính tiện lợi: cầm tay sạch sẽ, không dính mỡ, ăn gọn nạp đầy pin ngày làm việc.
7. **Bố cục 7: Oceanic Teal & Savory Melt (Thanh mát đậm đà)**
   * *Món*: Sandwich Cá Ngừ Phô Mai (60.000đ)
   * *File*: `ai-concept-tuna-melt-crunch.jpg`
   * *Bố cục*: Tông màu xanh biển thanh thoát, làm nổi bật phần xốt cá ngừ béo ngậy quyện hành tây giòn ngọt và mozzarella xém mặt.
8. **Bố cục 8: Sunday Slow Brunch Editorial (Tạp chí ẩm thực)**
   * *Món*: Sandwich Nướng Kiểu Pháp (55.000đ)
   * *File*: `ai-concept-sunday-brunch-editorial.jpg`
   * *Bố cục*: Viền khung thanh lịch phong cách tạp chí món ăn cuối tuần, thư thái thưởng thức chậm rãi cùng đồ uống.

---

## 4. Quy Tắc Cấm Tuyệt Đối (Strict Negative Constraints)

1. **Tuyệt đối KHÔNG có thương hiệu "EGG DROP"**:
   * Khi tạo prompt sinh ảnh bằng AI (Midjourney, Flux, Ideogram, Gemini), **không bao giờ** dùng cụm từ *"Korean egg drop sandwich"* vì các mô hình AI sẽ tự động sinh chữ "EGG DROP" của chuỗi nhà hàng Hàn Quốc lên hộp giấy và biển hiệu xung quanh.
   * Luôn dùng cụm từ: *"Korean-style brioche egg sandwich in a clean, blank white paper takeout box with yellow bottom accent"*.
   * Kiểm tra toàn cảnh bức ảnh: hộp bánh, cốc giấy, khăn ăn (napkin) và biển hiệu cửa hàng phía sau, đảm bảo sạch sẽ 100% không dính chữ "EGG DROP" hay "ISAAC TOAST".
2. **Không để logo bay lơ lửng trên thức ăn**:
   * Logo và nhãn hiệu phải nằm **chính xác trên bề mặt hộp giấy**, tuyệt đối không dán đè lên phần ruột bánh mì, phô mai tan chảy hay trứng cuộn.
3. **Đúng góc phối cảnh 3D (Perspective & Lighting)**:
   * Mặt hộp trong ảnh chụp luôn có góc nghiêng 3D. Artwork EGGU phải được xoay, nghiêng và gọt viền (clip) chuẩn theo góc nghiêng của hộp.

---

## 5. Quy Trình Chỉnh Sửa & Xử Lý Kỹ Thuật (Pipeline)

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

---

## 6. Pipeline Tự Động Biến Đổi Bối Cảnh & Đồng Bộ Ánh Sáng Theo Caption (Automated Contextual Relighting Engine)

Hệ thống tự động hóa hoàn toàn quy trình sáng tạo "ẢNH AI THIẾT KẾ" cho n8n và Admin Dashboard theo 4 bước khép kín:

### Bước 1: Giữ nguyên chủ thể (Product Consistency)
* Sử dụng file tách nền chuẩn (alpha mask): `public/images/eggu-sandwich-subject-cutout.png` trích xuất từ mẫu bánh chuẩn đã được phê duyệt.
* **Bảo toàn 100%**:
  * Vỏ bánh mì brioche nướng bơ tỏi vàng rụm.
  * Tầng trứng cuộn fluffy mềm mượt tan chảy, sốt cheddar béo ngậy và thịt xông khói áp chảo.
  * Hộp giấy cầm tay màu trắng in đầy đủ dải viền vàng đáy hộp, mascot ôm trứng *Bite into goodness* và logo đỏ **EGGU**.
* Loại bỏ triệt để nguy cơ AI bị ảo giác sinh ra logo đối thủ nước ngoài (*Egg Drop, Isaac Toast*).

### Bước 2: Tự động biến đổi bối cảnh theo Caption (Caption-to-Background Intelligence)
* Node LLM (Gemini) trong n8n phân tích tự động ngữ cảnh, thời gian, cảm xúc và địa điểm từ Caption:
  * **Công sở / Đi làm vội vã**: Nền bàn làm việc văn phòng tối giản, laptop mờ ảo, ly cold brew cà phê, ánh nắng sáng sớm qua khung kính.
  * **Trời mưa Hà Nội**: Khung cửa sổ quán cafe ngắm mưa phố cổ, giọt mưa đọng trên kính, ánh đèn vàng amber ấm cúng, bokeh đèn đường.
  * **Sunday Brunch**: Bàn đá cẩm thạch trắng, tách latte art hoa văn, ánh sáng tự nhiên dịu nhẹ ngày nghỉ.
  * **Dạo phố cuối tuần**: Không gian phố đi bộ Hồ Gươm rực rỡ nắng chiều, nhộn nhịp, trẻ trung.
* Tự động sinh `ai_image_prompt` bằng tiếng Anh chuẩn nhiếp ảnh thương mại (Commercial food photography backdrop, bokeh f/2.0).

### Bước 3: Ghép và đồng bộ ánh sáng (Relighting & Harmonization)
* **Depth of field (Xóa phông)**: Tái tạo chiều sâu trường ảnh với khẩu độ lớn (f/1.8 – f/2.8), bối cảnh phía sau được làm mờ mềm mại (creamy bokeh) để làm nổi bật chiếc bánh.
* **Đồng bộ ánh sáng (Ambient Relighting)**: Điều chỉnh cân bằng trắng, nhiệt độ màu và độ bão hòa của chiếc bánh khớp hoàn hảo với nguồn sáng môi trường (ví dụ: vàng hổ phách ấm áp cho ngày mưa, trong trẻo hiện đại cho văn phòng).
* **Bóng đổ tiếp xúc (Contact Shadow)**: Tạo bóng đổ đa tầng (deep contact shadow + soft ambient shadow) dưới đáy hộp giấy và bàn tay cầm, đảm bảo chiếc bánh đặt vững chắc tự nhiên trong không gian.

### Bước 4: Đầu ra (Output Dispatching)
* API Engine: `POST /api/marketing/compose-ai-concept` (`src/lib/marketing/aiPhotoEngine.ts`).
* Xuất file ảnh vuông độ phân giải cao 1000x1000px, chất lượng 92%.
* Tự động upload lên Supabase Storage bucket `promotions/` với `cacheControl: 0` và version tag.
* Trả về URL ảnh công khai để n8n lưu vào bảng `marketing_posts` và đẩy lên Google Sheets / mạng xã hội.
