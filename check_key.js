const fs = require('fs');
const content = fs.readFileSync('.env.local', 'utf8');
const match = content.match(/GEMINI_API_KEY=(.*)/);
if (match) {
    const key = match[1].trim();
    console.log('Key length:', key.length);
    console.log('Key prefix:', key.substring(0, 4));
} else {
    console.log('GEMINI_API_KEY not found');
}
