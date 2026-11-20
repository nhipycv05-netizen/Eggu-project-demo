const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const urls = JSON.parse(fs.readFileSync('threads_extracted_urls.json', 'utf8'));

// Filter out avatars (usually contain t51.82787-19)
const postUrls = urls.filter(u => !u.includes('t51.82787-19') && (u.includes('t51.82787-15') || u.includes('t51.71878-15')));

console.log('Post photo candidates:', postUrls.length);

const downloadDir = 'public/images/threads-real/';
if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir, { recursive: true });

async function downloadAll() {
  const downloaded = [];
  let count = 0;

  for (let i = 0; i < postUrls.length; i++) {
    const url = postUrls[i];
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      
      const meta = await sharp(buf).metadata();
      // Only keep photos with width >= 400 and height >= 400
      if (meta.width >= 400 && meta.height >= 400) {
        count++;
        const filename = `threads-photo-${count}.jpg`;
        const dest = path.join(downloadDir, filename);
        fs.writeFileSync(dest, buf);
        downloaded.push({ filename, width: meta.width, height: meta.height, size: buf.length, url });
        console.log(`[${count}] Saved ${filename}: ${meta.width}x${meta.height} (${buf.length} bytes)`);
        if (count >= 12) break;
      }
    } catch (e) {
      // ignore
    }
  }

  fs.writeFileSync('threads_downloaded_summary.json', JSON.stringify(downloaded, null, 2));
  console.log('Finished downloading', downloaded.length, 'high-res real photos from Threads @hhnh_7410!');
}

downloadAll();
