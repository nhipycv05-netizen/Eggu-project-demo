const fs = require('fs');
const path = require('path');

const uploadDir = 'C:/Users/ASUS/.gemini/antigravity/brain/1d5b6f3a-5cfa-4681-84b1-f5a7a5ddea7a/.user_uploaded/';
const destDir = 'public/images/social-real/';

if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

const files = [
  'media_1795114666296_cc4bc6d5.jpg',
  'media_1795114710088_25485093.jpg',
  'media_1795114788210_fe22edea.jpg',
  'media_1795114870912_848a3308.jpg',
  'media_1795114926710_9eb63d53.jpg',
  'media_1795114969174_cd39abc6.png',
  'media_1795105215911_80046cef.jpg',
  'media_1795105487186_5fd8900c.jpg'
];

files.forEach((f, idx) => {
  const src = path.join(uploadDir, f);
  const ext = path.extname(f);
  const dest = path.join(destDir, `social-photo-${idx + 1}${ext}`);
  fs.copyFileSync(src, dest);
  console.log(`Copied ${f} -> social-photo-${idx + 1}${ext}`);
});
