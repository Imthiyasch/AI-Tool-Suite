const { GoogleGenAI } = require('@google/genai');

async function test(modelName) {
    const apiKey = process.env.GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey });
    console.log(`--- Testing ${modelName} ---`);
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: [{ role: 'user', parts: [{ text: 'Respond with a single word: Yes' }] }],
        });
        console.log(`SUCCESS:`, response.text);
        return true;
    } catch (e) {
        console.log(`FAILED:`, e.message);
        return false;
    }
}

test('gemini-3.1-flash-lite');
