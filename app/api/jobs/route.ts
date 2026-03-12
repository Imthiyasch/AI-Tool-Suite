import { NextResponse } from 'next/server';
import FirecrawlApp from '@mendable/firecrawl-js';

const app = new FirecrawlApp({
    apiKey: process.env.FIRECRAWL_API_KEY
});

interface JobItem {
    title?: string;
    description?: string;
    snippet?: string;
    url?: string;
}

export async function POST(request: Request) {
    try {
        const { query, location } = await request.json();

        if (!query) {
            return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
        }

        const searchQuery = `${query} job listings ${location ? `in ${location}` : ''}`;
        
        console.log("Searching for:", searchQuery);

        // Search for job URLs - returns SearchData directly
        const searchResult = await app.search(searchQuery, {
            limit: 5,
        });

        console.log("Firecrawl raw result type:", typeof searchResult);
        console.log("Firecrawl result keys:", Object.keys(searchResult || {}));

        // The SDK returns web results directly in searchResult.web
        const rawJobs = (searchResult.web as JobItem[]) || [];

        if (rawJobs.length === 0) {
            return NextResponse.json({ jobs: [], message: 'No jobs found for this query.' });
        }

        const jobs = rawJobs.map((item: JobItem) => ({
            title: item.title || 'Job Listing',
            snippet: item.description || item.snippet || 'No description available.',
            url: item.url,
            source: item.url ? new URL(item.url).hostname.replace('www.', '') : 'Unknown'
        }));

        return NextResponse.json({ jobs });

    } catch (error: unknown) {
        const err = error as Error;
        console.error("Job search error:", err);
        return NextResponse.json({ error: err.message || 'An error occurred during job search' }, { status: 500 });
    }
}
