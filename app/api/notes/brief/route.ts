import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' })

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch notes from the last 24 hours
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        
        const { data: notes, error } = await supabase
            .from('notes')
            .select('*')
            .gte('created_at', twentyFourHoursAgo)
            .order('created_at', { ascending: false })

        if (error) throw error

        if (!notes || notes.length === 0) {
            return NextResponse.json({ 
                brief: "No recent neural activity detected. Your mind is a clean slate today.",
                count: 0
            })
        }

        const noteContents = notes.map(n => n.content).filter(Boolean).join('\n---\n')

        if (!noteContents) {
            return NextResponse.json({ 
                brief: "Media captured but no text analysis yet. Your visual/audio memory is growing.",
                count: notes.length
            })
        }

        // Generate Brief
        const prompt = `You are the Brevio Lumio Neural Engine. Below are the notes captured by the user in the last 24 hours.
Synthesize them into a 2-3 sentence "Daily Neural Brief" that highlights the core focus or recurring themes.
Be punchy, professional, and slightly futuristic in tone.

Notes:
${noteContents}

Neural Brief:`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });

        const brief = response.text || "Synthesis failed. Neural pathways disconnected.";

        return NextResponse.json({ brief, count: notes.length })

    } catch (error: unknown) {
        const err = error as Error;
        console.error('Neural Brief Error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
