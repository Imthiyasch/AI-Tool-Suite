const { GoogleGenAI } = require('@google/genai');

async function test(modelName) {
    const apiKey = 'AIzaSyDjwvCkkCFV5nPV62i-6YM4Vm_dSDa_cGk';
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

const models = [
    'gemini-3.1-flash-lite',
    'gemini-2.5-flash-lite',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro'
];

async function runAll() {
    for (const model of models) {
        await test(model);
    }
}

runAll();

