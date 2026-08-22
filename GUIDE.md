# Hướng dẫn Khởi chạy Local & Sử dụng Hệ thống EGGU

Tài liệu này hướng dẫn chi tiết cách cài đặt, khởi chạy dự án **EGGU - Korean Egg Sandwich** trên môi trường cục bộ (local) và cách sử dụng các tính năng dành cho Khách hàng (Customer) cũng như Quản trị viên (Admin).

---

## PHẦN 1: HƯỚNG DẪN CÀI ĐẶT & CHẠY LOCAL

### 1. Chuẩn bị Môi trường
Dự án được xây dựng dựa trên framework **Next.js 16 (React 19)** và **Supabase**. Hãy đảm bảo máy tính của bạn đã cài đặt:
- **Node.js** (Khuyến nghị phiên bản LTS từ v20 trở lên)
- **NPM** hoặc **Yarn**

### 2. Cài đặt Dependencies
Mở terminal tại thư mục gốc của dự án và chạy lệnh sau để cài đặt toàn bộ thư viện:
```bash
npm install
```

### 3. Cấu hình Biến Môi Trường (Environment Variables)
Tạo file `.env.local` tại thư mục gốc của dự án và điền các thông số Supabase của bạn:
```env
NEXT_PUBLIC_SUPABASE_URL=https://bnblofcypxfydnptazrs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_3htZtlySK0R61iVBgZfL9A_rjj0jeAz
# Khoá bảo mật Server-side (Dùng để bỏ qua RLS khi truy vấn admin/action)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 4. Thiết lập Cơ sở dữ liệu Supabase
Để ứng dụng hoạt động chính xác với đầy đủ dữ liệu mẫu:
1. Truy cập vào giao diện quản trị **Supabase Console** -> **SQL Editor**.
2. Mở file [20260822000000_init_schema.sql](file:///Users/leduycuong/Desktop/Projects/nextjs/Eggu-project-demo/supabase/migrations/20260822000000_init_schema.sql) và chạy lệnh SQL để khởi tạo các bảng dữ liệu (`categories`, `products`, `orders`, v.v.).
3. Mở file [20260822000001_add_anon_insert_policies.sql](file:///Users/leduycuong/Desktop/Projects/nextjs/Eggu-project-demo/supabase/migrations/20260822000001_add_anon_insert_policies.sql) chạy tiếp để bật quyền gửi đơn hàng cho khách hàng không đăng nhập.
4. Mở tiếp file [seed.sql](file:///Users/leduycuong/Desktop/Projects/nextjs/Eggu-project-demo/supabase/seed.sql) chạy toàn bộ lệnh SQL để thêm danh mục, món ăn, chi nhánh và tài khoản admin mẫu.

### 5. Khởi chạy Ứng dụng
- **Chạy môi trường phát triển (Development):**
  ```bash
  npm run dev
  ```
  Truy cập ứng dụng tại địa chỉ: [http://localhost:3000](http://localhost:3000)

- **Biên dịch & Chạy môi trường sản xuất (Production Build):**
  ```bash
  npm run build
  npm run start
  ```

---

## PHẦN 2: HƯỚNG DẪN SỬ DỤNG CHO KHÁCH HÀNG (CUSTOMER)

Khách hàng truy cập vào trang web công cộng để đặt món ăn, cập nhật tin tức và tìm kiếm chi nhánh mà **không bắt buộc phải đăng nhập**. Hệ thống tự động dịch song ngữ Anh - Việt dựa trên lựa chọn của khách hàng.

### 1. Duyệt Thực Đơn (`/[locale]/menu`)
- Khách hàng bấm **Thực đơn** trên thanh điều hướng.
- Sử dụng thanh trượt danh mục phía trên để lọc nhanh các loại món ăn: **Bánh mì kẹp (Sandwich)**, **Bánh mì nướng (Toast)**, **Đồ uống (Drinks)**, **Cà phê (Coffee)**, v.v.
- Các món ăn mới sẽ có badge màu nâu **NEW**, món ăn bán chạy nhất sẽ gắn badge vàng **Best Seller**.

### 2. Tùy Chỉnh Topping & Thêm Vào Giỏ (`/[locale]/menu/[slug]`)
- Bấm **Tùy chỉnh** trên thẻ món ăn để xem thông tin chi tiết: mô tả, thành phần dinh dưỡng, cảnh báo dị ứng.
- **Thêm Topping:** Bấm chọn các tuỳ chọn đi kèm (ví dụ: *Thêm phô mai Cheddar*, *Thêm thịt xông khói*). Giá tiền tổng cộng sẽ tự động cập nhật ngay trên màn hình.
- **Yêu cầu đặc biệt:** Nhập ghi chú chế biến (ví dụ: *Không hành*, *Sốt để riêng*).
- Điều chỉnh số lượng và bấm **Thêm Vào Giỏ** để lưu món ăn. Hệ thống sẽ chuyển hướng khách hàng tới trang giỏ hàng.

### 3. Quản lý Giỏ Hàng (`/[locale]/cart`)
- Hiển thị danh sách các món ăn đã chọn kèm theo danh sách topping và ghi chú riêng biệt.
- Khách hàng có thể tăng/giảm số lượng trực tiếp hoặc bấm nút thùng rác để xoá món.
- Xem chi tiết bảng giá tạm tính, phí vận chuyển đồng giá (20,000 VND), và tổng số tiền thanh toán cuối cùng.

### 4. Đặt Hàng Nhận Tiền mặt - COD (`/[locale]/checkout`)
- Bấm **Tiến Hành Thanh Toán** từ giỏ hàng.
- Nhập thông tin giao hàng bao gồm: **Họ tên**, **Số điện thoại**, **Địa chỉ chi tiết** và **Lời nhắn cho tài xế**.
- Bấm **Đặt Hàng Ngay (COD)**. Hệ thống sẽ gửi thông tin lên máy chủ để tính toán giá tiền (bảo mật tuyệt đối, không tin tưởng giá gửi từ client) và lưu trữ đơn hàng.

### 5. Xem Trạng Thế Thành Công (`/[locale]/order-success`)
- Trang hiển thị thông báo đặt hàng thành công cùng **Mã Đơn Hàng** duy nhất (định dạng `EGGU-YYYYMMDD-XXXX`).
- Hiển thị đầy đủ thông tin giao nhận, chi tiết món ăn kèm giá trị COD mà khách hàng cần thanh toán cho tài xế lúc nhận bánh.

---

## PHẦN 3: HƯỚNG DẪN SỬ DỤNG CHO QUẢN TRỊ VIÊN (ADMIN)

Quản trị viên sử dụng bảng điều khiển riêng biệt để quản lý đơn hàng theo thời gian thực và chỉnh sửa thông tin thực đơn của cửa hàng.

### 1. Đăng Nhập Hệ Thống (`/admin/login`)
- Truy cập liên kết: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Nhập tài khoản admin (Dữ liệu mẫu trong seed file):
  - **Email:** `admin@eggu.vn`
  - **Mật khẩu:** `admin123`
- *Lưu ý:* Hệ thống bảo vệ tự động bằng middleware bảo mật, nếu chưa đăng nhập, mọi lượt truy cập vào `/admin/*` đều bị chuyển hướng về trang login.

### 2. Theo Dõi Đơn Hàng Thời Gian Thực (`Orders`)
- Bấm tab **Orders** trên sidebar bên trái.
- **Real-time Live Monitoring:** Khi có bất kỳ khách hàng nào đặt hàng mới, đơn hàng sẽ tự động xuất hiện trên danh sách của Admin ngay lập tức mà **không cần tải lại trang web** (nhờ cơ chế Supabase Realtime).
- Bấm chọn đơn hàng để xem chi tiết: danh sách topping, ghi chú chế biến, số điện thoại và địa chỉ giao hàng.
- **Thay đổi trạng thái:** Sử dụng menu dropdown để chuyển trạng thái xử lý đơn hàng:
  - `NEW` (Mới nhận) -> `CONFIRMED` (Đã xác nhận) -> `PREPARING` (Đang chuẩn bị bánh) -> `DELIVERING` (Đang giao hàng) -> `COMPLETED` (Giao thành công) / `CANCELLED` (Đã huỷ).
  - Khi chuyển sang `COMPLETED`, trạng thái thanh toán của đơn hàng sẽ tự động chuyển thành **PAID** (Đã thanh toán).

### 3. Quản Lý Thực Đơn & Chi Nhánh (CRUD)
Sử dụng các tab tương ứng trên sidebar để thực hiện các thao tác Thêm, Sửa, Xoá dữ liệu:
- **Products:** Quản lý món ăn, chỉnh sửa tên tiếng Anh/Việt, giá tiền, thứ tự hiển thị, slug, link ảnh món ăn và bật/tắt hoạt động của món ăn đó trên thực đơn công cộng.
- **Categories:** Quản lý danh mục nhóm món ăn phục vụ cho bộ lọc.
- **Stores:** Cập nhật thông tin chi nhánh cửa hàng, số hotline và toạ độ bản đồ chỉ đường.
- **FAQs:** Soạn thảo câu hỏi thường gặp song ngữ để hiển thị dạng accordion ở trang FAQ của khách hàng.
- **News & Blog:** Tạo bài viết quảng cáo hoặc thông báo khuyến mãi (hỗ trợ nhập định dạng HTML trong ô nội dung bài viết).
- **Promotions:** Thiết lập mã giảm giá, mức giảm (phần trăm % hoặc số tiền mặt cố định), giá trị đơn hàng tối thiểu và thời hạn áp dụng voucher.
