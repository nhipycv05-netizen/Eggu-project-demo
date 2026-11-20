const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({ input: fs.createReadStream('C:/Users/ASUS/.gemini/antigravity/brain/1d5b6f3a-5cfa-4681-84b1-f5a7a5ddea7a/.system_generated/logs/transcript.jsonl') });

rl.on('line', (line) => {
  if (line.includes('media_1795114710088') || line.includes('media_1795114870912') || line.includes('media_1795114926710')) {
    const o = JSON.parse(line);
    if (o.type === 'USER_INPUT') {
      console.log('USER:', o.content);
    } else if (o.type === 'PLANNER_RESPONSE') {
      console.log('AGENT:', o.content?.slice(0, 300) || o.thinking?.slice(0, 300));
    }
  }
});
