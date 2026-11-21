const fs = require('fs');

async function fetchThreads() {
  const url = 'https://www.threads.net/@hhnh_7410';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5'
    }
  });
  console.log('Threads Status:', res.status);
  const text = await res.text();
  console.log('Threads HTML length:', text.length);
  fs.writeFileSync('scripts/threads-page.html', text, 'utf8');
  
  const matches = text.match(/https:\/\/[^"'\\s]+cdninstagram\.com\/[^"'\\s]+/g) || [];
  const unique = Array.from(new Set(matches));
  console.log('Found instagram CDN URLs:', unique.length);
  unique.slice(0, 15).forEach((u, i) => console.log(i, u));
}

fetchThreads();
