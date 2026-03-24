const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash', 'gemini-2.5-flash'];
  const log = [];
  
  for (const m of models) {
    try {
      await ai.models.generateContent({ model: m, contents: 'hello' });
      log.push(`[SUCCESS] ${m}`);
    } catch (e) {
      log.push(`[FAILED] ${m} - ${e.message}`);
    }
  }
  
  fs.writeFileSync('model_test_results.txt', log.join('\n'));
}

run();
