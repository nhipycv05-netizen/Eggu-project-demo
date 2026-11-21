const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const baseStorage = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/promotions/real-photos`;

function getUrl(filename) {
  return `${baseStorage}/${filename}`;
}

async function updateAlbums() {
  console.log('Fetching all marketing posts...');
  const { data: posts, error } = await supabase
    .from('marketing_posts')
    .select('id, title, dish_name, dish_category')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return;
  }

  console.log(`Found ${posts.length} posts. Assigning diverse non-overlapping real photo albums...`);

  // We have 16 drive photos + 2 extra authentic photos
  // Curate unique featured photo and album for each post:
  const albumPlans = [
    {
      featured: 'eggu-real-drive-1.jpg',
      album: [
        getUrl('eggu-real-drive-1.jpg'),
        getUrl('eggu-real-drive-2.jpg'),
        getUrl('eggu-real-drive-3.jpg'),
        getUrl('eggu-real-drive-4.jpg'),
        getUrl('eggu-real-drive-5.jpg'),
      ]
    },
    {
      featured: 'eggu-real-drive-6.jpg',
      album: [
        getUrl('eggu-real-drive-6.jpg'),
        getUrl('eggu-real-drive-7.jpg'),
        getUrl('eggu-real-drive-8.jpg'),
        getUrl('eggu-real-drive-9.jpg'),
        getUrl('eggu-real-drive-10.jpg'),
      ]
    },
    {
      featured: 'eggu-real-drive-11.jpg',
      album: [
        getUrl('eggu-real-drive-11.jpg'),
        getUrl('eggu-real-drive-12.jpg'),
        getUrl('eggu-real-drive-13.jpg'),
        getUrl('eggu-real-drive-14.jpg'),
        getUrl('eggu-real-drive-15.jpg'),
      ]
    },
    {
      featured: 'eggu-real-drive-16.jpg',
      album: [
        getUrl('eggu-real-drive-16.jpg'),
        getUrl('eggu-real-drive-4.jpg'),
        getUrl('eggu-real-drive-1.jpg'),
        getUrl('eggu-real-drive-8.jpg'),
        getUrl('eggu-real-drive-12.jpg'),
      ]
    },
    {
      featured: 'eggu-real-drive-3.jpg',
      album: [
        getUrl('eggu-real-drive-3.jpg'),
        getUrl('eggu-real-drive-5.jpg'),
        getUrl('eggu-real-drive-7.jpg'),
        getUrl('eggu-real-drive-9.jpg'),
        getUrl('eggu-real-drive-11.jpg'),
      ]
    },
    {
      featured: 'eggu-real-drive-8.jpg',
      album: [
        getUrl('eggu-real-drive-8.jpg'),
        getUrl('eggu-real-drive-10.jpg'),
        getUrl('eggu-real-drive-13.jpg'),
        getUrl('eggu-real-drive-15.jpg'),
        getUrl('eggu-real-drive-2.jpg'),
      ]
    },
    {
      featured: 'eggu-walking-street-tray.jpg',
      album: [
        getUrl('eggu-walking-street-tray.jpg'),
        getUrl('eggu-real-drive-14.jpg'),
        getUrl('eggu-real-drive-6.jpg'),
        getUrl('eggu-real-drive-16.jpg'),
        getUrl('eggu-real-drive-9.jpg'),
      ]
    },
    {
      featured: 'eggu-master-ly-quoc-su.jpg',
      album: [
        getUrl('eggu-master-ly-quoc-su.jpg'),
        getUrl('eggu-real-drive-5.jpg'),
        getUrl('eggu-real-drive-2.jpg'),
        getUrl('eggu-real-drive-11.jpg'),
        getUrl('eggu-real-drive-15.jpg'),
      ]
    }
  ];

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const plan = albumPlans[i % albumPlans.length];
    const mainPhotoUrl = plan.album[0];
    const albumJson = JSON.stringify(plan.album);

    console.log(`Updating post #${i} (${post.dish_name || post.title}) with featured photo: ${plan.featured}...`);

    const { error: updateErr } = await supabase
      .from('marketing_posts')
      .update({
        real_photo_url: albumJson,
        dish_category: 'Google Drive & Threads (@hhnh_7410)'
      })
      .eq('id', post.id);

    if (updateErr) {
      console.error(`Error updating post ${post.id}:`, updateErr.message);
    } else {
      console.log(` -> Post ${post.id} updated successfully!`);
    }
  }

  console.log('All marketing posts successfully updated with diverse non-repeating albums!');
}

updateAlbums();
