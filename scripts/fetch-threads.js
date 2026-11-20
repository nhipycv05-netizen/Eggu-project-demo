const fs = require('fs');

async function run() {
  const urls = [
    'https://www.threads.net/@hhnh_7410',
    'https://www.threads.net/@hhnh_7410?igshid=NTc4MTIwNjQ2YQ=='
  ];

  for (const url of urls) {
    console.log('Fetching:', url);
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
          'sec-fetch-dest': 'document',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'none'
        }
      });
      console.log('Status:', res.status);
      const html = await res.text();
      fs.writeFileSync('threads_output.html', html);
      console.log('HTML length:', html.length);
      
      const imgRegex = /https:\/\/[^"'\s\\]+?(?:cdninstagram|fbcdn)[^"'\s\\]+?/gi;
      const matches = html.match(imgRegex) || [];
      console.log('Total cdn matches:', matches.length);
      
      // Look for post text or images
      const ogImage = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
      if (ogImage) console.log('OG Image:', ogImage[1]);

      const ogDesc = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i);
      if (ogDesc) console.log('OG Description:', ogDesc[1]);

      // Unique images
      const unique = [...new Set(matches)];
      console.log('Unique images:', unique.length);
      unique.slice(0, 15).forEach((u, i) => console.log(`[${i+1}] ${u}`));
      break;
    } catch (e) {
      console.error('Fetch error:', e);
    }
  }
}

run();
