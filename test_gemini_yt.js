const { GoogleGenAI } = require('@google/genai');

async function test() {
    process.env.GEMINI_API_KEY = "[REVOKED_API_KEY]D8LcqJ3vwR8AOLg";
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze the YouTube video at https://www.youtube.com/watch?v=nOtbhE53nQY and provide exactly three things in the following JSON format:
{
  "summary": "Detailed summary...",
  "mindmap": "Mermaid.js mindmap syntax representing the key topics. Use mindmap\\n root((Root Note))\\n  Child1\\n  Child2 structure. Do not wrap in markdown block just the code.",
  "transcript": "The full spoken transcript of the video, as close to verbatim as possible."
}
IMPORTANT: Only output valid JSON, no markdown formatting blocks around it.`,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });
        require('fs').writeFileSync('gemini_out.txt', response.text);
        console.log("Written to gemini_out.txt");
    } catch (e) {
        console.error(e);
    }
}
test();
