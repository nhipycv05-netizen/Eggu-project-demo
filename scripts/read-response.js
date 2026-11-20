const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({ input: fs.createReadStream('C:/Users/ASUS/.gemini/antigravity/brain/1d5b6f3a-5cfa-4681-84b1-f5a7a5ddea7a/.system_generated/logs/transcript.jsonl') });

let found = false;
rl.on('line', (line) => {
  if (line.includes('nó vẫn ra ảnh web vậy')) {
    found = true;
  } else if (found && line.includes('"type":"PLANNER_RESPONSE"')) {
    const o = JSON.parse(line);
    console.log(o.content || o.thinking?.slice(0, 500));
    found = false;
  }
});
