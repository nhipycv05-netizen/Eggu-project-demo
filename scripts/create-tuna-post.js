const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const exactFooter = `🥪Tiktok: https://www.tiktok.com/@eggu_sandwich?_r=1&_t=ZS-9AH0avwHF7l
👉Website: https://eggusandwich.id.vn/
📍 54 Nguyễn Hữu Huân, Hoàn Kiếm, Hà Nội
🛵 Giao hàng thần tốc trên: Website/ ShopeeFood / Grab / Be / Green / EGets
📞 0356 779 899
⏰ 07:00 – 21:00
#Eggu #SandwichHanQuoc #EggSandwich #FoodInHanoi #newwebsite #anvatHoGuom`;

const tunaPhotos = [
  'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/social-real-tuna-tomato.jpg',
  'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/social-real-bacon-cheese.jpg',
  'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/social-real-story-beef.jpg',
  'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/social-real-handheld-crispy.jpg',
  'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/social-real-egg-scramble.jpg'
];

const content = `Cuối tuần thong thả ghé phố cổ, tự thưởng cho mình một bữa ăn vừa thơm ngon, vừa giàu dinh dưỡng cùng Sandwich Cá Ngừ Phô Mai nóng hổi từ EGGU!

Lớp bánh mì brioche nướng bơ tỏi vàng rụm bên ngoài, cắn vào là phần nhân cá ngừ đậm vị quyện cùng phô mai béo ngậy kéo sợi và trứng cuộn fluffy mềm mượt tan chảy. Thêm chút sốt đặc trưng chuẩn vị Seoul thơm nức mũi, đảm bảo no lâu và nạp tràn năng lượng cho ngày cuối tuần.

👉 Giá niêm yết: 60.000đ

${exactFooter}`;

const aiPrompt = encodeURIComponent('Commercial advertising food photography of Korean tuna melt egg sandwich, golden crispy brioche toast, overflowing fluffy scrambled eggs, melted cheese pull, cozy aesthetic Seoul cafe table background, warm natural sunlight, cinematic lighting, 8k resolution, ultra photorealistic, mouth-watering advertising shot');
const aiPhotoUrl = 'https://image.pollinations.ai/prompt/' + aiPrompt + '?width=1080&height=1080&nologo=true&seed=205';

async function createTuna() {
  const { data, error } = await supabase.from('marketing_posts').insert({
    title: 'EGGU - Sandwich Cá Ngừ Phô Mai Nóng Hổi Giòn Rụm',
    dish_name: 'SANDWICH CÁ NGỪ PHÔ MAI',
    dish_category: 'Threads (@hanoifoodie_eat)',
    dish_price: '60.000đ',
    target_angle: 'Nạp năng lượng cuối tuần (Tự thưởng cho bản thân bữa ăn nóng hổi chất lượng chuẩn vị Seoul)',
    content: content,
    real_photo_url: JSON.stringify(tunaPhotos),
    ai_photo_url: aiPhotoUrl,
    status: 'PENDING'
  }).select();

  if (error) {
    console.error('Error creating Tuna post:', error);
  } else {
    console.log('Successfully created fresh Tuna post:', data[0].id);
  }
}

createTuna();
