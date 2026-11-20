const fs = require('fs');

const wf = JSON.parse(fs.readFileSync('./workflows/n8n-content-automation.json', 'utf8'));
const flow = wf[0] || wf;
const node = flow.nodes.find(n => n.id === 'b002-fb-context');

const baseUrl = 'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/';

const newCode = `const serviceKey = 'sb_secret_b0IcObDVlfwIlKpClSJD_Q_bAAK8DxJ';

// 1. LẤY GIÁ NIÊM YẾT CHUẨN TỪ WEBSITE
let products = [];
try {
  const res = await fetch('https://bnblofcypxfydnptazrs.supabase.co/rest/v1/products?category_id=eq.1a111111-1111-1111-1111-111111111111&is_available=eq.true&select=name_vi,price', {
    headers: { apikey: serviceKey, Authorization: 'Bearer ' + serviceKey }
  });
  products = await res.json();
} catch (e) {}

if (!products || !products.length) {
  products = [
    { name_vi: "SANDWICH THỊT XÔNG KHÓI BƠ TỎI PHÔ MAI", price: 55000 },
    { name_vi: "SANDWICH THỊT BÒ NƯỚNG TERIYAKI", price: 70000 },
    { name_vi: "SANDWICH TRỨNG PHÔ MAI", price: 40000 },
    { name_vi: "SANDWICH DĂM BÔNG PHÔ MAI MỸ", price: 50000 },
    { name_vi: "SANDWICH GÀ NƯỚNG PESTO", price: 60000 },
    { name_vi: "SANDWICH THỊT HỘP, PHÔ MAI & NORI", price: 60000 },
    { name_vi: "SANDWICH THỊT XÔNG KHÓI NGÔ PHÔ MAI", price: 50000 },
    { name_vi: "SANDWICH CÁ NGỪ PHÔ MAI", price: 60000 },
    { name_vi: "SANDWICH NƯỚNG KIỂU PHÁP", price: 55000 }
  ];
}

// 2. KHO ẢNH THẬT 100% KÉO TỪ THREADS CHÍNH THỨC CỦA TIỆM (@hhnh_7410)
const realSocialPhotos = [
  { dishName: "SANDWICH THỊT HỘP, PHÔ MAI & NORI", url: "https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/real-customer-tray-streetwalk.jpg" },
  { dishName: "SANDWICH THỊT XÔNG KHÓI BƠ TỎI PHÔ MAI", url: "https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/threads-real-1.jpg" },
  { dishName: "SANDWICH THỊT BÒ NƯỚNG TERIYAKI", url: "https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/threads-real-3.jpg" },
  { dishName: "SANDWICH DĂM BÔNG PHÔ MAI MỸ", url: "https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/threads-real-4.jpg" },
  { dishName: "SANDWICH TRỨNG PHÔ MAI", url: "https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/threads-real-7.jpg" },
  { dishName: "SANDWICH CÁ NGỪ PHÔ MAI", url: "https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/threads-real-8.jpg" },
  { dishName: "SANDWICH GÀ NƯỚNG PESTO", url: "https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/threads-real-12.jpg" },
  { dishName: "SANDWICH THỊT XÔNG KHÓI NGÔ PHÔ MAI", url: "https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/threads-real-13.jpg" },
  { dishName: "SANDWICH NƯỚNG KIỂU PHÁP", url: "https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/threads-real-5.jpg" }
];

// Chọn 1 món chính trong ngày
const primaryIndex = Math.floor(Math.random() * realSocialPhotos.length);
const primaryPhoto = realSocialPhotos[primaryIndex];
const matchedProduct = products.find(p => p.name_vi === primaryPhoto.dishName) || products[0];

// Chọn thêm 4 ảnh thật từ kho Threads để tạo album 5 tấm
const otherPhotos = realSocialPhotos.filter((_, idx) => idx !== primaryIndex);
const shuffledOthers = otherPhotos.sort(() => 0.5 - Math.random());
const selectedPhotosList = [primaryPhoto.url, ...shuffledOthers.slice(0, 4).map(p => p.url)];

const today = new Date();
const dayOfWeek = today.getDay();

let angle = "";
let suggestedTheme = "";
if (dayOfWeek === 1 || dayOfWeek === 3) {
  angle = "Đồng hành công sở (Bữa sáng vội vã, ăn sạch tay không dính mỡ, no lâu, gom đơn cùng đồng nghiệp)";
  suggestedTheme = "morning_commute";
} else if (dayOfWeek === 2 || dayOfWeek === 4) {
  angle = "Cứu đói xế chiều 14h - 16h (Thèm phô mai kéo sợi ngập tràn, tiếp năng lượng giờ làm việc uể oải)";
  suggestedTheme = "street_bold";
} else if (dayOfWeek === 5) {
  angle = "Nạp năng lượng cuối tuần (Tự thưởng cho bản thân bữa ăn nóng hổi chất lượng chuẩn vị Seoul)";
  suggestedTheme = "seoul_cafe";
} else {
  angle = "Dạo phố cổ Hồ Gươm (Bánh nướng nóng hổi cầm tay dạo quanh phố 54 Nguyễn Hữu Huân)";
  suggestedTheme = "hanoi_vintage";
}

const formattedPrice = Number(matchedProduct.price).toLocaleString('vi-VN') + 'đ';

return [
  {
    json: {
      dishName: matchedProduct.name_vi,
      dishPrice: formattedPrice,
      dishPriceRaw: matchedProduct.price,
      photoUrl: primaryPhoto.url,
      realPhotos: selectedPhotosList,
      realPhotosJson: JSON.stringify(selectedPhotosList),
      socialSource: "Threads",
      sourceHandle: "@hhnh_7410",
      photoTag: "Threads (@hhnh_7410)",
      targetAngle: angle,
      suggestedTheme: suggestedTheme,
      date: today.toLocaleDateString("vi-VN"),
      storeAddress: "54 Nguyễn Hữu Huân, Hoàn Kiếm, Hà Nội",
      website: "https://eggusandwich.id.vn/",
      tiktok: "https://www.tiktok.com/@eggu_sandwich?_r=1&_t=ZS-9AH0avwHF7l",
      hotline: "0356 779 899",
      hours: "07:00 – 21:00"
    }
  }
];`;

node.parameters.jsCode = newCode;
fs.writeFileSync('./workflows/n8n-content-automation.json', JSON.stringify(wf, null, 2), 'utf8');
console.log('Successfully updated b002-fb-context in workflows/n8n-content-automation.json');
