const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({ input: fs.createReadStream('C:/Users/ASUS/.gemini/antigravity/brain/1d5b6f3a-5cfa-4681-84b1-f5a7a5ddea7a/.system_generated/logs/transcript_full.jsonl') });

rl.on('line', (line) => {
  if (line.includes('1795114') && line.includes('"type":"USER_INPUT"')) {
    const o = JSON.parse(line);
    console.log('--- USER INPUT AT', o.created_at);
    console.log(o.content);
  }
});
