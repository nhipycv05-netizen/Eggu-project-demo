const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  const { data, error } = await supabase.from('marketing_posts').select('id, title, dish_name, real_photo_url, ai_photo_url');
  if (error) {
    console.error('Error:', error);
    return;
  }
  data.forEach((p, i) => {
    console.log(`[${i}] Title: "${p.title}"`);
    console.log(`     Dish: ${p.dish_name}`);
    console.log(`     AI photo: ${p.ai_photo_url}`);
    console.log(`     Real photo: ${p.real_photo_url}`);
  });
}
check();
