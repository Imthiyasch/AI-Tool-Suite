const { GoogleGenAI } = require('@google/genai');

async function test() {
    process.env.GEMINI_API_KEY = "[REVOKED_API_KEY]D8LcqJ3vwR8AOLg";
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a helpful assistant that analyzes YouTube videos. 
Please watch the following YouTube video and provide three specific outputs. Output ONLY a raw valid JSON object — no markdown fences, no explanation, just the JSON:
{
  "summary": "..comprehensive summary with markdown headings and bullet points..",
  "mindmap": "mindmap\n  root((Video Title))\n    Topic1\n      Subtopic1\n    Topic2",
  "transcript": "..detailed outline or script of the video dialogue and flow.."
}

Video URL: https://www.youtube.com/watch?v=nOtbhE53nQY`,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });
        const text = response.text;
        console.log("Raw response length:", text.length);
        console.log("First 500 chars:", text.substring(0, 500));
        require('fs').writeFileSync('gemini_debug.txt', text);
    } catch (e) {
        console.error(e);
    }
}
test();
