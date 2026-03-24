import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
const videoId = 'dQw4w9WgXcQ';

const prompt = `You are a knowledgeable assistant with information about YouTube videos.

For the YouTube video at: ${url} (Video ID: ${videoId})

Generate a detailed analysis. Return ONLY a valid JSON object with these keys:
- "summary": A comprehensive markdown summary with ## headings and bullet points describing what this video is about, its key points, and important takeaways.
- "mindmap": A valid Mermaid.js mindmap as a raw string (start with "mindmap" on first line, use 2-space indentation, root((Video Title)) for the root). 
- "transcript": A simulated detailed script/outline with timestamps [0:00], [1:30] etc showing how the video likely flows.
- "thread": A series of 5-7 punchy social media (X/Twitter style) posts that breakdown the video for high engagement. Each post should be separated by "---".
- "title": A catchy, SEO-optimized title for this video analysis.

If you don't have specific knowledge of this video, generate educational content based on the topic suggested by the video ID and URL context. Always provide helpful content rather than refusing.`;

async function test() {
    try {
        console.log("Calling Gemini...");
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                responseMimeType: 'application/json'
            }
        });
        
        console.log("Success! Response:");
        console.log(response.text.substring(0, 500) + '...');
        const parsed = JSON.parse(response.text);
        console.log("Parsed keys:", Object.keys(parsed));
    } catch (e) {
        console.error("Test failed:", e);
    }
}
test();
