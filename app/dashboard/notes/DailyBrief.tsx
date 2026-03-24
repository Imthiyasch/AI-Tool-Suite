'use client'

import React, { useEffect, useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'

export const DailyBrief = () => {
    const [brief, setBrief] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBrief = async () => {
            try {
                const res = await fetch('/api/notes/brief')
                const data = await res.json()
                setBrief(data.brief)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchBrief()
    }, [])

    if (loading) return (
        <div className="glass-panel p-8 animate-pulse flex items-center gap-4">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--text-secondary)' }} />
            <div className="h-4 w-3/4 rounded" style={{ background: 'var(--bg-input)' }} />
        </div>
    )

    if (!brief) return null

    return (
        <div className="relative group overflow-hidden glass-panel p-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#69f0ae] opacity-5 -mr-16 -mt-16 rotate-45 group-hover:scale-150 transition-transform duration-700" />
            
            <div className="flex items-start gap-6">
                <div className="bg-[#69f0ae] text-black p-4 rounded-xl shadow-sm flex-shrink-0">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                    <h4 className="text-[#69f0ae] font-black uppercase tracking-[0.2em] text-[10px] mb-3">
                        Daily Neural Brief / 24h Synthesis
                    </h4>
                    <p className="text-xl md:text-2xl font-bold italic leading-relaxed pr-10" style={{ color: 'var(--text-primary)' }}>
                        &quot;{brief}&quot;
                    </p>
                </div>
            </div>
            
            {/* Decorative dots */}
            <div className="absolute bottom-4 left-4 flex gap-2">
                <div className="w-1 h-1 bg-zinc-800" />
                <div className="w-1 h-1 bg-zinc-800" />
                <div className="w-1 h-1 bg-zinc-800" />
            </div>
        </div>
    )
}
