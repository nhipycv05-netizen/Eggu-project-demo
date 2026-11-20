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

const realPhotos = [
  'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/social-real-bacon-cheese.jpg',
  'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/social-real-story-beef.jpg',
  'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/social-real-handheld-crispy.jpg',
  'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/social-real-egg-scramble.jpg',
  'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/social-real-tuna-tomato.jpg',
  'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/social-real-chicken-herbs.jpg',
  'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/social-real-corn-bacon.jpg',
  'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/social-real-kitchen-fresh.jpg'
];

async function updateAll() {
  const { data: posts, error } = await supabase.from('marketing_posts').select('*');
  if (error) {
    console.error('Error fetching posts:', error);
    return;
  }

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    
    // Pick 5 real photos rotating per post
    const postPhotos = [];
    for (let j = 0; j < 5; j++) {
      postPhotos.push(realPhotos[(i + j) % realPhotos.length]);
    }

    // Ensure content has clean body + exact footer
    let body = (post.content || '').split(/🥪Tiktok|👉Website|📍 54 Nguyễn Hữu Huân|#Eggu|#EGGU/)[0].trim();
    if (!body || body.startsWith('{') || body.length < 40) {
      body = `Bắt đầu ngày mới cùng chiếc bánh mì sandwich trứng Hàn Quốc ${post.dish_name || 'EGGU'} nóng hổi, giòn rụm từ EGGU!\n\nLớp bánh brioche nướng bơ tỏi thơm lừng, ôm trọn phần trứng cuộn fluffy mềm mượt tan chảy cùng phô mai béo ngậy kéo sợi và sốt đặc trưng chuẩn vị Seoul. Từng miếng cắn đậm đà, no lâu mà lại cực kỳ sạch tay, hoàn hảo cho bữa sáng hoặc xế chiều.\n\n👉 Giá niêm yết: ${post.dish_price || '55.000đ'}`;
    }
    const cleanContent = body + '\n\n' + exactFooter;

    // AI photo url
    let aiUrl = post.ai_photo_url;
    if (!aiUrl || aiUrl.includes('localhost') || aiUrl.includes('about-vision')) {
      const prompt = encodeURIComponent(`Commercial advertising food photography of ${post.dish_name || 'Korean egg sandwich'}, golden crispy brioche toast, overflowing fluffy scrambled eggs, melted cheese pull, modern aesthetic Seoul cafe background, cinematic soft warm sunlight, 8k resolution, ultra photorealistic, mouth-watering marketing shot`);
      aiUrl = 'https://image.pollinations.ai/prompt/' + prompt + '?width=1080&height=1080&nologo=true&seed=' + (1000 + i);
    } else if (aiUrl.includes('model=flux')) {
      aiUrl = aiUrl.replace('&model=flux', '');
    }

    const { error: updateErr } = await supabase.from('marketing_posts').update({
      real_photo_url: JSON.stringify(postPhotos),
      ai_photo_url: aiUrl,
      content: cleanContent
    }).eq('id', post.id);

    if (updateErr) {
      console.error('Error updating post', post.id, updateErr);
    } else {
      console.log('Updated post', post.id, post.dish_name);
    }
  }
  console.log('Finished updating all posts in Supabase!');
}

updateAll();
