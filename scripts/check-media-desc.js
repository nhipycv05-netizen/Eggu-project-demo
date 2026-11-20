const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({ input: fs.createReadStream('C:/Users/ASUS/.gemini/antigravity/brain/1d5b6f3a-5cfa-4681-84b1-f5a7a5ddea7a/.system_generated/logs/transcript_full.jsonl') });

let found = false;
rl.on('line', (line) => {
  if (line.includes('media_1795114666296')) {
    found = true;
  } else if (found && line.includes('"type":"PLANNER_RESPONSE"')) {
    const o = JSON.parse(line);
    console.log('PLANNER:', o.thinking?.slice(0, 1000));
    found = false;
  }
});
