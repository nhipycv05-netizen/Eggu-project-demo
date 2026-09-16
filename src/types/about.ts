export interface AboutContent {
  mainTitle: string;
  subTitle: string;
  
  // Section 1: Chân dung / Khởi nguồn
  section1Image: string;
  section1Text: string;
  
  // Section 2: Đoạn thông điệp nổi bật
  section2Text: string;
  
  // Section 3: Cam kết chất lượng & Sản phẩm
  section3Title?: string;
  section3Text: string;
  section3Image: string;
}

export const DEFAULT_ABOUT_CONTENT: AboutContent = {
  mainTitle: 'VỀ CHÚNG TÔI',
  subTitle: 'Eggu · Sandwich trứng Hàn Quốc',
  section1Image: '/images/about-founder.png',
  section1Text: 'Eggu ra đời từ một mong muốn đơn giản nhưng đầy tâm huyết: mang đến những bữa ăn nhanh, tiện lợi nhưng vẫn trọn vẹn dinh dưỡng và đậm đà hương vị cho tất cả mọi người.',
  section2Text: 'Từ niềm tin rằng bữa ăn sáng hay một món ăn nhẹ giữa ngày không chỉ để lót bụng, mà còn là khoảnh khắc tiếp thêm năng lượng tích cực, Eggu chiêu đãi thực khách các món sandwich nướng kèm phô mai thơm lừng ôm trọn lớp trứng xốp mềm ngập tràn hương vị, thêm vào đó là sự hấp dẫn của rất nhiều loại topping đa dạng như thịt xông khói, dăm bông, cá ngừ,... Đây chính là lời chào ngọt ngào nhất Eggu gửi tới bạn.',
  section3Title: '',
  section3Text: 'Với nguồn nguyên liệu tươi mới từ 100% trứng gà sạch đạt chuẩn, rau củ tươi trong ngày và các loại thịt, phô mai cao cấp, cùng với đó là công thức đặc biệt tạo nên nước sốt độc quyền giúp hương vị thêm phần trọn vẹn. Eggu sẽ mang đến cho bạn trải nghiệm ẩm thực không chỉ mãn nhãn mà còn tràn đầy hương vị!',
  section3Image: '/images/about-sandwiches.png',
};
