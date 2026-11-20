const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const threadsUrls = JSON.parse(fs.readFileSync('threads_supabase_urls.json', 'utf8'));
const realTrayUrl = 'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/real-customer-tray-streetwalk.jpg';

const allRealPhotos = [realTrayUrl, ...threadsUrls];

async function updatePosts() {
  const { data: posts, error } = await supabase.from('marketing_posts').select('*');
  if (error) {
    console.error('Error fetching posts:', error);
    return;
  }

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    
    // Pick 5 distinct real photos from Threads pool, rotating
    const album = [];
    for (let j = 0; j < 5; j++) {
      album.push(allRealPhotos[(i * 3 + j) % allRealPhotos.length]);
    }

    const { error: err } = await supabase.from('marketing_posts').update({
      real_photo_url: JSON.stringify(album),
      dish_category: 'Threads (@hhnh_7410)'
    }).eq('id', post.id);

    if (err) console.error('Error updating', post.id, err);
    else console.log(`✓ Updated post ${i+1}: ${post.dish_name} with 5 REAL photos from Threads @hhnh_7410`);
  }
}

updatePosts();
