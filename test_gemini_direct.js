const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function testGemini() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('GEMINI_API_KEY not found in .env.local');
            return;
        }

        const ai = new GoogleGenAI({ apiKey });
        console.log('Testing Gemini with model gemini-2.5-flash...');
        
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: 'Say "Gemini is WORKING"',
            });
            console.log('Response:', response.text);
        } catch (e) {
            console.error('Gemini call failed:', e.message);
            console.log('Trying with contents as array...');
            try {
                const response2 = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: [{ role: 'user', parts: [{ text: 'Say "Gemini is WORKING"' }] }],
                });
                console.log('Response (array):', response2.text);
            } catch (e2) {
                console.error('Gemini call (array) failed:', e2.message);
            }
        }
    } catch (e) {
        console.error('General error:', e);
    }
}

testGemini();
