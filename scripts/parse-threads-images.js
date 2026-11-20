const fs = require('fs');
const html = fs.readFileSync('threads_output.html', 'utf8');

const matches = [];
const regex = /https:\/\/[^"'\s\\]+?\.(?:jpg|png|webp)[^"'\s\\]*/gi;
let m;
while ((m = regex.exec(html)) !== null) {
  let url = m[0].replace(/&amp;/g, '&');
  if ((url.includes('cdninstagram') || url.includes('fbcdn')) && !url.includes('static.cdninstagram')) {
    matches.push(url);
  }
}

const unique = [...new Set(matches)];
console.log('Unique image URLs found:', unique.length);

fs.writeFileSync('threads_extracted_urls.json', JSON.stringify(unique, null, 2));

unique.slice(0, 20).forEach((u, i) => {
  console.log(`[${i+1}] ${u.slice(0, 120)}...`);
});
