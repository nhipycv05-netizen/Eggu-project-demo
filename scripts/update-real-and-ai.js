const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const realCustomerUrl = 'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/real-customer-tray-streetwalk.jpg';

const mapping = {
  'SANDWICH THỊT BÒ NƯỚNG TERIYAKI': 'ai-branded-beef-teriyaki.jpg',
  'SANDWICH THỊT HỘP, PHÔ MAI & NORI': 'ai-branded-beef-teriyaki.jpg',
  'SANDWICH THỊT XÔNG KHÓI BƠ TỎI PHÔ MAI': 'ai-branded-bacon-cheese.jpg',
  'SANDWICH DĂM BÔNG PHÔ MAI MỸ': 'ai-branded-ham-cheese.jpg',
  'SANDWICH TRỨNG PHÔ MAI': 'ai-branded-fluffy-egg.jpg',
  'SANDWICH CÁ NGỪ PHÔ MAI': 'ai-branded-tuna-melt.jpg',
  'SANDWICH GÀ NƯỚNG PESTO': 'ai-branded-chicken-pesto.jpg',
  'SANDWICH THỊT XÔNG KHÓI NGÔ PHÔ MAI': 'ai-branded-corn-bacon.jpg',
  'SANDWICH NƯỚNG KIỂU PHÁP': 'ai-branded-french-toast.jpg'
};

const baseUrl = 'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/';

async function updateRealAndAi() {
  const { data: posts, error } = await supabase.from('marketing_posts').select('*');
  for (const post of posts) {
    const file = mapping[post.dish_name] || 'ai-branded-bacon-cheese.jpg';
    const newAiUrl = baseUrl + file;

    let realList = [];
    try {
      realList = JSON.parse(post.real_photo_url);
    } catch {
      realList = [post.real_photo_url];
    }

    // Add real customer tray photo as the #1 primary photo
    if (!realList.includes(realCustomerUrl)) {
      realList.unshift(realCustomerUrl);
    }
    // Limit to 5 photos
    realList = realList.slice(0, 5);

    await supabase.from('marketing_posts').update({
      real_photo_url: JSON.stringify(realList),
      ai_photo_url: newAiUrl
    }).eq('id', post.id);

    console.log('Updated post:', post.dish_name, '| AI:', file, '| Real Count:', realList.length);
  }
}

updateRealAndAi();
