import { NextResponse } from 'next/server';
import FirecrawlApp from '@mendable/firecrawl-js';
import { GoogleGenAI } from '@google/genai';

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
    try {
        const { question } = await request.json();

        if (!question || !question.trim()) {
            return NextResponse.json({ error: 'A question is required' }, { status: 400 });
        }

        // 1. Use Firecrawl to search the web for relevant sources
        let sources: Array<{ title: string; url: string; snippet: string }> = [];
        try {
            const searchResult: any = await firecrawl.search(question, { limit: 5 });
            console.log('Firecrawl raw result keys:', Object.keys(searchResult || {}));
            console.log('Firecrawl result sample:', JSON.stringify(searchResult).slice(0, 500));
            
            // Try all possible response shapes from different SDK versions
            const rawResults =
                searchResult?.data ||
                searchResult?.results ||
                searchResult?.web ||
                (Array.isArray(searchResult) ? searchResult : null) ||
                [];

            sources = rawResults.slice(0, 5).map((item: any) => ({
                title: item.title || item.metadata?.title || item.url || 'Source',
                url: item.url || item.metadata?.sourceURL || '#',
                snippet: item.description || item.snippet || item.markdown?.slice(0, 300) || item.content?.slice(0, 300) || 'No preview available.',
            }));
        } catch (firecrawlErr: any) {
            console.warn('Firecrawl search failed:', firecrawlErr?.message || firecrawlErr);
        }

        // 2. Build context from search results for Gemini
        const sourcesContext = sources.length > 0
            ? sources.map((s, i) => `Source [${i + 1}]: ${s.title}\nURL: ${s.url}\nExcerpt: ${s.snippet}`).join('\n\n')
            : 'No external sources available. Use your training knowledge to answer.';

        // 3. Synthesize with Gemini
        const prompt = `You are an expert AI research assistant. Answer the following question thoroughly using the provided web sources where relevant. Always cite sources using [1], [2] etc. when referencing them.

QUESTION: ${question}

WEB SOURCES:
${sourcesContext}

Provide a comprehensive, well-structured answer in markdown format with:
- A direct answer to the question
- Key insights and relevant details
- Source citations [1], [2] etc. inline where applicable
Keep the response informative but concise (300-500 words).`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });

        const answer = response.text || 'No answer generated. Please try again.';
        return NextResponse.json({ answer, sources });

    } catch (error: unknown) {
        const err = error as Error;
        console.error('Research error:', err);
        return NextResponse.json({ error: err.message || 'An error occurred during research' }, { status: 500 });
    }
}
