import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Extract video ID from YouTube URL
function extractVideoId(url: string): string | null {
    const patterns = [
        /(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

export async function POST(request: Request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 });
        }

        const videoId = extractVideoId(url);
        if (!videoId) {
            return NextResponse.json({ error: 'Invalid YouTube URL. Please use a standard YouTube link.' }, { status: 400 });
        }

        // Single call: Ask Gemini to generate all three components as JSON
        // Using responseMimeType without googleSearch (compatible combination)
        const prompt = `You are a knowledgeable assistant with information about YouTube videos.

For the YouTube video at: ${url} (Video ID: ${videoId})

Generate a detailed analysis. Return ONLY a valid JSON object with these keys:
- "summary": A comprehensive markdown summary with ## headings and bullet points describing what this video is about, its key points, and important takeaways.
- "mindmap": A valid Mermaid.js mindmap as a raw string (start with "mindmap" on first line, use 2-space indentation, root((Video Title)) for the root). 
- "transcript": A simulated detailed script/outline with timestamps [0:00], [1:30] etc showing how the video likely flows.
- "thread": A series of 5-7 punchy social media (X/Twitter style) posts that breakdown the video for high engagement. Each post should be separated by "---".
- "title": A catchy, SEO-optimized title for this video analysis.

If you don't have specific knowledge of this video, generate educational content based on the topic suggested by the video ID and URL context. Always provide helpful content rather than refusing.`;

        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                responseMimeType: 'application/json'
            }
        });

        const text = response.text || '';

        if (!text || text.trim().length < 20) {
            return NextResponse.json({ error: 'AI could not generate a response. Please try again.' }, { status: 500 });
        }

        let summary = '';
        let mindmap = '';
        let transcript = '';
        let thread = '';
        let title = '';

        try {
            const cleaned = text.replace(/^```json\s*/m, '').replace(/```\s*$/m, '').trim();
            const parsed = JSON.parse(cleaned);
            summary = parsed.summary || '';
            mindmap = parsed.mindmap || '';
            transcript = parsed.transcript || '';
            thread = parsed.thread || '';
            title = parsed.title || '';
        } catch (e) {
            console.error('Failed to parse JSON, using raw text as summary:', e);
            summary = text;
        }

        return NextResponse.json({ summary, mindmap, transcript, thread, title, videoId });

    } catch (error: unknown) {
        const err = error as Error;
        console.error("Summarization error:", err);
        return NextResponse.json({ error: err.message || 'An error occurred during summarization' }, { status: 500 });
    }
}
