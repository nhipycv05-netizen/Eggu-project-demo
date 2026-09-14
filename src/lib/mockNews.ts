export interface NewsArticleItem {
  id: string;
  title_vi: string;
  title_en: string;
  slug: string;
  summary_vi: string;
  summary_en: string;
  content_vi: string;
  content_en: string;
  thumbnail_url: string;
  status: 'DRAFT' | 'PUBLISHED';
  published_at: string;
}

export const MOCK_NEWS_ARTICLES: NewsArticleItem[] = [
  {
    id: 'news-1',
    title_vi: 'Khai Trương Cửa Hàng EGGU Đầu Tiên Tại Phố Đi Bộ Nguyễn Huệ!',
    title_en: 'Grand Opening of First EGGU Store on Nguyen Hue Walking Street!',
    slug: 'grand-opening-nguyen-hue',
    summary_vi: 'Chào đón thành viên đầu tiên tại trung tâm Sài Gòn sôi động cùng chuỗi sự kiện đặc biệt rinh quà miễn phí và ưu đãi Mua 1 Tặng 1.',
    summary_en: 'Join the grand opening events of our first branch in Ho Chi Minh City with free signature sandwiches and exclusive Buy 1 Get 1 discounts.',
    content_vi: `
      <p>Chúng tôi vô cùng tự hào thông báo chi nhánh đầu tiên của chuỗi bánh mì kẹp trứng bơ sữa cao cấp EGGU sẽ chính thức đi vào hoạt động tại địa chỉ <strong>123 Nguyễn Huệ, Quận 1</strong> bắt đầu từ ngày 25/08/2026.</p>
      <p>Hãy đến chung vui để nhận ngập tràn ưu đãi <strong>Mua 1 Tặng 1</strong> dành cho dòng bánh Mr. Egg trứ danh và cùng trải nghiệm không gian F&B chuẩn phong cách Hàn Quốc trẻ trung, thanh lịch!</p>
      <h3>Trải nghiệm ẩm thực trứng bơ sữa chuẩn Hàn</h3>
      <p>Sản phẩm của chúng tôi được tuyển chọn từ nguồn nguyên liệu tuyệt hảo nhất: bánh mì brioche mềm xốp được nướng tươi mỗi ngày bằng bơ Pháp hảo hạng, kết hợp cùng phô mai Cheddar béo ngậy và đặc biệt là lớp trứng bác (scrambled egg) bông mịn chế biến từ trứng tươi thanh trùng.</p>
      <p>Ngoài ra, EGGU còn phục vụ các thức uống mát lạnh đậm vị Hàn Quốc như Cà phê sữa tươi kem trứng béo ngậy, Trà dâu tây ủ lạnh tươi mát giúp cân bằng hoàn hảo hương vị bữa sáng.</p>
      <p>Hẹn gặp bạn tại EGGU Nguyễn Huệ vào tuần lễ khai trương để nhận vô vàn quà tặng voucher và quà lưu niệm dễ thương!</p>
    `,
    content_en: `
      <p>We are thrilled to announce the official grand opening of our very first premium Korean Egg Sandwich store at <strong>123 Nguyen Hue, District 1</strong> starting August 25, 2026.</p>
      <p>Come celebrate with us to receive a special <strong>Buy 1 Get 1 Free</strong> promotion on our classic Mr. Egg sandwich and immerse yourself in a modern, cozy Korean F&B aesthetic!</p>
      <h3>Authentic Korean Soft Scramble Toast Experience</h3>
      <p>All sandwiches are crafted with the highest precision and top-grade ingredients: fresh soft scrambled eggs, melted real Cheddar cheese, garlic-butter toasted brioche buns, and our signature sweet mayo sriracha sauce.</p>
      <p>In addition, EGGU offers a refreshing lineup of beverages including Egg Cream Iced Coffee and Cold Brew Strawberry Tea, perfectly pairing with your morning toast.</p>
      <p>We look forward to welcoming you at EGGU Nguyen Hue during our opening week!</p>
    `,
    thumbnail_url: '/images/hero-sandwich.jpg',
    status: 'PUBLISHED',
    published_at: new Date('2026-08-22T17:00:00+07:00').toISOString(),
  },
  {
    id: 'news-2',
    title_vi: 'Bí Quyết Tạo Nên Lớp Trứng Bác Khuấy Bông Mịn Chuẩn Vị Hàn',
    title_en: 'The Secret Behind EGGU Signature Fluffy Scrambled Eggs',
    slug: 'bi-quyet-trung-khuay-bong-min',
    summary_vi: 'Khám phá quy trình chế biến độc quyền với trứng tươi thanh trùng và bơ lạt nguyên chất tạo nên độ mềm tan khó cưỡng.',
    summary_en: 'Discover our exclusive culinary technique using pasteurized farm-fresh eggs and pure French butter for that irresistible melt-in-mouth texture.',
    content_vi: `
      <p>Điều làm nên linh hồn của mỗi chiếc bánh mì kẹp EGGU chính là lớp trứng khuấy dày dặn, vàng ươm và mềm tan như mây khi vừa chạm đầu lưỡi.</p>
      <h3>1. Nguồn nguyên liệu trứng gà sạch thanh trùng</h3>
      <p>EGGU hợp tác độc quyền cùng các nông trại chuẩn VietGAP, tuyển chọn từng quả trứng tươi mới mỗi ngày. Trứng được xử lý thanh trùng bằng công nghệ nhiệt hiện đại, đảm bảo an toàn tuyệt đối đồng thời giữ trọn vẹn dinh dưỡng.</p>
      <h3>2. Kỹ thuật khuấy liên tục trên chảo gang nhiệt độ thấp</h3>
      <p>Đầu bếp tại EGGU kiểm soát nhiệt độ chảo ở mức 75°C - 80°C, kết hợp cùng bơ lạt béo ngậy và sữa tươi nguyên kem. Bằng các đường cuộn nhẹ nhàng liên tục, từng lớp trứng tạo thành nếp gấp sóng mềm mại giữ lại tối đa độ ẩm.</p>
      <p>Hãy ghé ngay cửa hàng EGGU gần nhất để thưởng thức bánh nóng hổi vừa ra lò nhé!</p>
    `,
    content_en: `
      <p>What makes every EGGU toast truly unforgettable is the generous, golden, and cloud-like soft-scrambled egg layer that melts effortlessly on your palate.</p>
      <h3>1. Farm-fresh Pasteurized Eggs</h3>
      <p>EGGU partners with premium certified farms, sourcing fresh eggs every morning. Using low-temperature pasteurization, we ensure food safety while preserving high nutritional value.</p>
      <h3>2. Gentle Fold Technique on Low-Heat Cast Iron</h3>
      <p>Our chefs maintain pan temperature strictly around 75°C - 80°C, blending pure unsalted butter with whole cream. Gentle, rhythmic folding creates beautiful egg waves packed with moisture and buttery aroma.</p>
      <p>Visit your nearest EGGU store today to taste the warm perfection!</p>
    `,
    thumbnail_url: '/images/carousel/sandwich-egg-scramble.jpg',
    status: 'PUBLISHED',
    published_at: new Date('2026-08-28T09:30:00+07:00').toISOString(),
  },
  {
    id: 'news-3',
    title_vi: 'Ra Mắt Bộ Sưu Tập Toast Mới: Bơ Sáp Avocado & Sweet Corn Bacon',
    title_en: 'New Toast Lineup: Fresh Avocado Holic & Sweet Corn Bacon',
    slug: 'ra-mat-bo-suu-tap-toast-moi',
    summary_vi: 'Bộ đôi siêu phẩm mang phong vị tươi mát từ bơ sáp tự nhiên và bắp ngọt giòn mọng nước đã chính thức có mặt tại EGGU.',
    summary_en: 'Two new sensational recipes featuring fresh creamy avocado and sweet juicy corn with crispy bacon are now live on our menu.',
    content_vi: `
      <p>Thực đơn EGGU vừa bổ sung 2 thành viên mới đầy hấp dẫn, hứa hẹn mang đến trải nghiệm hương vị bùng nổ cho các tín đồ mê trứng và bánh mì nướng:</p>
      <ul>
        <li><strong>Avocado Holic Toast:</strong> Sự kết hợp tuyệt mỹ giữa bơ sáp tươi Đà Lạt thái lát dày, trứng khuấy bông mịn cùng sốt kem thảo mộc nhẹ nhàng, giàu dinh dưỡng cho bữa sáng lành mạnh.</li>
        <li><strong>Sweet Corn & Bacon Toast:</strong> Vị ngọt thanh giòn ngọt từ hạt bắp tươi hòa quyện cùng thịt xông khói áp chảo đậm đà và phô mai Cheddar kéo sợi.</li>
      </ul>
      <p>Cả 2 món mới đều được áp dụng đồng thời với các mã ưu đãi giảm giá hiện có trên website. Đặt ngay để là người đầu tiên trải nghiệm nhé!</p>
    `,
    content_en: `
      <p>EGGU menu has officially introduced two delicious additions designed to elevate your toast breakfast experience:</p>
      <ul>
        <li><strong>Avocado Holic Toast:</strong> Thick slices of fresh ripe avocado layered over fluffy scrambled eggs and herb cream drizzle, delivering wholesome vitamins and healthy fats.</li>
        <li><strong>Sweet Corn & Bacon Toast:</strong> Juicy crisp sweet corn kernels paired with pan-seared smoked bacon strips and melted Cheddar cheese.</li>
      </ul>
      <p>Both new items are eligible for active promo vouchers online. Place your order now to enjoy!</p>
    `,
    thumbnail_url: '/images/carousel/sandwich-bacon-cheese.jpg',
    status: 'PUBLISHED',
    published_at: new Date('2026-09-05T14:00:00+07:00').toISOString(),
  },
];
