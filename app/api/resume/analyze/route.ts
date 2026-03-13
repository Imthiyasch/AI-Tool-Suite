import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import * as pdf from 'pdf-parse';
import mammoth from 'mammoth';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        let extractedText = '';

        console.log(`Analyzing file: ${file.name}, size: ${buffer.length}, type: ${file.type}`);

        // Extract text based on file type
        try {
            if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
                console.log('Extracting text from PDF...');
                const parser = new pdf.PDFParse({ data: buffer });
                const result = await parser.getText();
                extractedText = result.text;
                console.log('PDF extraction success, chars:', extractedText.length);
            } else if (
                file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                file.name.toLowerCase().endsWith('.docx')
            ) {
                console.log('Extracting text from DOCX...');
                const result = await mammoth.extractRawText({ buffer });
                extractedText = result.value;
                console.log('DOCX extraction success, chars:', extractedText.length);
            } else {
                console.log('Fallback to plain text extraction...');
                extractedText = buffer.toString('utf-8');
                console.log('Text extraction success, chars:', extractedText.length);
            }
        } catch (extractErr) {
            console.error('Text extraction failed:', extractErr);
            return NextResponse.json({ error: 'Failed to read file content. Please ensure it is a valid PDF or DOCX.' }, { status: 422 });
        }

        if (!extractedText || extractedText.trim().length < 50) {
            console.error('Extracted text too short or empty');
            return NextResponse.json({ error: 'The resume content seems too short or unreadable.' }, { status: 422 });
        }

        // Use Gemini to analyze the resume
        try {
            console.log('Sending to Gemini for analysis...');
            const prompt = `You are an expert HR and Career Coach AI. Analyze the following resume text and provide a structured JSON response.
Return ONLY valid JSON with the following schema:
{
  "name": "full name",
  "summary": "a brief 2-3 sentence professional summary",
  "skills": ["skill1", "skill2", "skill3"],
  "targetRoles": ["role1", "role2", "role3"],
  "experienceYears": "number or range",
  "education": ["degree1", "degree2"],
  "matchScore": "a number from 0-100 indicating how strong this profile is",
  "improvementPoints": ["point1", "point2", "point3"]
}

Resume Text:
${extractedText.substring(0, 15000)}`;

            const response = await ai.models.generateContent({
                model: 'gemini-1.5-flash', // Switching to 1.5-flash for better compatibility
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                config: {
                    responseMimeType: 'application/json'
                }
            });

            const responseText = response.text || '';
            console.log('Gemini response received');
            
            // Clean markdown code blocks if present
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            const jsonStr = jsonMatch ? jsonMatch[0] : responseText;
            
            const analysis = JSON.parse(jsonStr);
            return NextResponse.json({ analysis });

        } catch (aiErr: any) {
            console.error('Gemini analysis error:', aiErr);
            
            // Check for common API errors
            const errorMsg = aiErr.message || '';
            if (errorMsg.includes('PERMISSION_DENIED')) {
                return NextResponse.json({ error: 'Gemini API Key error: Permission denied. Please check your API key and billing status.' }, { status: 500 });
            }
            if (errorMsg.includes('NOT_FOUND')) {
                return NextResponse.json({ error: 'Gemini API error: Model not found. This might be a region restriction or invalid model name.' }, { status: 500 });
            }
            
            return NextResponse.json({ error: 'AI analysis failed: ' + (aiErr.message || 'Unknown error') }, { status: 500 });
        }

    } catch (error: unknown) {
        const err = error as Error;
        console.error('Outer Resume analysis error:', err);
        return NextResponse.json({ error: err.message || 'An error occurred during process' }, { status: 500 });
    }
}
