const { GoogleGenAI } = require('@google/genai');

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey });
    console.log('Attempting to list models...');
    try {
        // I'm not sure if @google/genai has a listModels method like the old one
        // Let's check the ai object
        console.log('AI keys:', Object.keys(ai));
        if (ai.models && ai.models.list) {
            const models = await ai.models.list();
            console.log('Models:', models);
        } else {
            console.log('No list method found on ai.models');
        }
    } catch (e) {
        console.error('List models failed:', e.message);
    }
}

listModels();
