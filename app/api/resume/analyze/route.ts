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

        // Extract text based on file type
        if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
            const parser = new pdf.PDFParse({ data: buffer });
            const result = await parser.getText();
            extractedText = result.text;
        } else if (
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
            file.name.endsWith('.docx')
        ) {
            const result = await mammoth.extractRawText({ buffer });
            extractedText = result.value;
        } else {
            // Fallback to plain text
            extractedText = buffer.toString('utf-8');
        }

        if (!extractedText || extractedText.trim().length === 0) {
            return NextResponse.json({ error: 'Could not extract text from the file.' }, { status: 422 });
        }

        // Use Gemini to analyze the resume
        // Following the pattern from summarize/route.ts
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are an expert HR and Career Coach AI. Analyze the following resume text and provide a structured JSON response.
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
${extractedText.substring(0, 10000)}`,
            config: {
                responseMimeType: 'application/json'
            }
        });

        const responseText = response.text || '';
        
        // Clean markdown code blocks if present
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : responseText;
        
        const analysis = JSON.parse(jsonStr);

        return NextResponse.json({ analysis });

    } catch (error: unknown) {
        const err = error as Error;
        console.error('Resume analysis error:', err);
        return NextResponse.json({ error: err.message || 'An error occurred during analysis' }, { status: 500 });
    }
}
