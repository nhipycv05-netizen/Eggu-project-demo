const fs = require('fs');

async function inspectDrive() {
  const url = 'https://drive.google.com/drive/folders/1WcjdHJsWOxOO6vKQ3Y1IpnpO-DcDNYQn?usp=sharing';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  console.log('Drive Status:', res.status);
  const text = await res.text();
  console.log('HTML length:', text.length);
  fs.writeFileSync('scripts/drive-page.html', text, 'utf8');
  console.log('Saved scripts/drive-page.html');
}

inspectDrive();
