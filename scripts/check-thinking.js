const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({ input: fs.createReadStream('C:/Users/ASUS/.gemini/antigravity/brain/1d5b6f3a-5cfa-4681-84b1-f5a7a5ddea7a/.system_generated/logs/transcript_full.jsonl') });

rl.on('line', (line) => {
  if (line.includes('media_1795114710088')) {
    const o = JSON.parse(line);
    if (o.type === 'PLANNER_RESPONSE') {
      console.log('Thinking 1795114710088:\n', o.thinking?.slice(0, 800));
    }
  }
});
