const { GoogleGenAI } = require('@google/genai');

async function testModel(modelName) {
    const apiKey = process.env.GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey });
    console.log(`Testing model ${modelName}...`);
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: [{ role: 'user', parts: [{ text: 'Say "Working"' }] }],
        });
        console.log(`${modelName} success:`, response.text);
        return true;
    } catch (e) {
        console.error(`${modelName} failed:`, e.message);
        return false;
    }
}

async function run() {
    await testModel('models/gemini-1.5-flash');
    await testModel('gemini-1.5-flash');
    await testModel('models/gemini-pro');
}

run();
