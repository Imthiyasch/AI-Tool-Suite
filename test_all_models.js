const { GoogleGenAI } = require('@google/genai');

async function test(modelName) {
    const apiKey = process.env.GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey });
    console.log(`--- Testing ${modelName} ---`);
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: [{ role: 'user', parts: [{ text: 'Say "OK"' }] }],
        });
        console.log(`SUCCESS:`, response.text);
        return true;
    } catch (e) {
        console.log(`FAILED:`, e.message);
        return false;
    }
}

async function run() {
    const models = [
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-pro',
        'gemini-1.0-pro',
        'gemini-2.0-flash-exp',
        'gemini-2.0-flash'
    ];
    for (const m of models) {
        await test(m);
    }
}

run();
