export interface CoreValueItem {
  title: string;
  description: string;
}

export interface AboutContent {
  mainTitle: string;
  subTitle: string;
  
  // Section 1: Chân dung / Khởi nguồn
  section1Image: string;
  section1Text: string;
  
  // Section 2: Đoạn thông điệp nổi bật
  section2Text: string;
  
  // Section 3: Cam kết chất lượng & Sản phẩm / Tầm nhìn
  section3Title?: string;
  section3Text: string;
  section3ClosingText?: string;
  section3Image: string;

  // Section 4: Giá trị cốt lõi
  section4Title?: string;
  section4Items?: CoreValueItem[];
}

export const DEFAULT_ABOUT_CONTENT: AboutContent = {
  mainTitle: 'VỀ CHÚNG TÔI',
  subTitle: 'Eggu - Sandwich trứng Hàn Quốc',
  section1Image: '/images/about-founder.jpg',
  section1Text: 'Eggu ra đời từ một mong muốn đơn giản nhưng đầy tâm huyết: mang đến những bữa ăn nhanh, tiện lợi nhưng vẫn trọn vẹn dinh dưỡng và đậm đà hương vị cho tất cả mọi người.',
  section2Text: 'Chúng tôi tạo ra những ổ bánh mỳ độc đáo, sáng tạo, tiện lợi và mang cá tính riêng - phục vụ đúng khẩu vị, đúng lúc, đúng cách mà mỗi thực khách muốn trong nhịp sống hiện đại.',
  section3Title: '',
  section3Text: 'Với tâm huyết và lòng hiếu khách, trong tương lai chúng tôi tham vọng trở thành thương hiệu bánh mỳ sandwich trứng số 1 trong lòng thế hệ trẻ Việt Nam và đồng thời dẫn đầu về trải nghiệm cá nhân hóa, tiện lợi và giúp mỗi khách hàng thể hiện gu trong ăn uống.',
  section3ClosingText: 'Eggu - nơi mỗi người đều có thể tìm thấy ổ bánh mỳ “đúng với mình”.',
  section3Image: '/images/about-vision.jpg',
  section4Title: '4. GIÁ TRỊ CỐT LÕI',
  section4Items: [
    {
      title: 'Tận tâm',
      description: 'Phục vụ bánh mỳ không có nghĩa là phục vụ đại trà, mà thay vào đó từng ổ bánh mỳ sandwich trứng được cá nhân hóa theo sở thích từng cá nhân',
    },
    {
      title: 'Trung thực',
      description: 'Mỗi chiếc bánh mỳ sandwich trứng tại Eggu được làm ra với sự trân trọng khách hàng, trân trọng không chỉ thể hiện ở hình thức thành phẩm bắt mắt, chỉn chu mà còn xuất phát từ nguồn nguyên liệu tươi sạch, chất lượng.',
    },
    {
      title: 'Sáng tạo',
      description: 'Sáng tạo để tạo nên sự khác biệt có chủ đích, mỗi ý tưởng mới đều hướng đến một chiếc sandwich ngon hơn, tiện hơn và hợp gu hơn.',
    },
  ],
};
