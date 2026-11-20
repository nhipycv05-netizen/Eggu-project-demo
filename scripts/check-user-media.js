const fs = require('fs');

const dir = 'C:/Users/ASUS/.gemini/antigravity/brain/1d5b6f3a-5cfa-4681-84b1-f5a7a5ddea7a/.user_uploaded/';
const files = fs.readdirSync(dir);

files.forEach(f => {
  if (f.startsWith('media_1795114') || f.startsWith('media_1795105')) {
    const stat = fs.statSync(dir + f);
    console.log(f, stat.size);
  }
});
