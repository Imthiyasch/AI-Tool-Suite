const { GoogleGenAI } = require('@google/genai');

async function testSummarize() {
    const apiKey = process.env.GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey });
    console.log('Testing Summarize prompt style...');
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Test prompt for summarization',
            config: {
                responseMimeType: 'application/json'
            }
        });
        console.log('Summarize success:', response.text);
    } catch (e) {
        console.error('Summarize failed:', e.message);
    }
}

testSummarize();
