const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\USER\\.gemini\\antigravity\\brain\\47f1919a-a1ac-456a-9a2c-4d345e3d4b3f\\.system_generated\\logs\\transcript_full.jsonl';

const fileStream = fs.createReadStream(logPath);
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

rl.on('line', (line) => {
  if (line.includes('ANTIGRAVITY MASTER PROMPT')) {
    try {
      const obj = JSON.parse(line);
      if (obj.content && obj.content.length > 5000) {
        fs.writeFileSync('docs/phases-17-21-master-prompt.md', obj.content);
        console.log('Saved full master prompt! Length:', obj.content.length);
      }
    } catch (e) {}
  }
});
