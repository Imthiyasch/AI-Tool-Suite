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
        <div className="bg-zinc-900 border-4 border-black p-8 animate-pulse flex items-center gap-4">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-700" />
            <div className="h-4 bg-zinc-800 w-3/4 rounded" />
        </div>
    )

    if (!brief) return null

    return (
        <div className="relative group overflow-hidden bg-zinc-950 border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(105,240,174,0.1)] hover:shadow-[12px_12px_0px_0px_rgba(105,240,174,0.2)] transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#69f0ae] opacity-5 -mr-16 -mt-16 rotate-45 group-hover:scale-150 transition-transform duration-700" />
            
            <div className="flex items-start gap-6">
                <div className="bg-[#69f0ae] text-black p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex-shrink-0">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                    <h4 className="text-[#69f0ae] font-black uppercase tracking-[0.2em] text-[10px] mb-3">
                        Daily Neural Brief / 24h Synthesis
                    </h4>
                    <p className="text-xl md:text-2xl font-bold text-white italic leading-relaxed pr-10">
                        "{brief}"
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
