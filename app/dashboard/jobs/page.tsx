'use client'

import { useState, useEffect, Suspense } from 'react'
import { Search, MapPin, Briefcase, ExternalLink, Loader2, Globe } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

interface Job {
    title: string;
    snippet: string;
    url: string;
    source: string;
}

function JobSearchContent() {
    const searchParams = useSearchParams()
    const [query, setQuery] = useState('')
    const [location, setLocation] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [jobs, setJobs] = useState<Job[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const q = searchParams.get('q')
        const l = searchParams.get('l')
        if (q) {
            setQuery(q)
            if (l) setLocation(l)
            // Auto trigger search if query is provided
            performSearch(q, l || '')
        }
    }, [searchParams])

    const performSearch = async (searchQuery: string, searchLocation: string) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: searchQuery, location: searchLocation })
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setJobs(data.jobs || [])
        } catch (err: unknown) {
            const errorObj = err as Error;
            setError(errorObj.message || 'Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return
        performSearch(query, location)
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20 font-sans">
            {/* Header section */}
            <div className="space-y-4">
                <div className="inline-block bg-[#69f0ae] text-black px-4 py-1 border-2 border-black font-black uppercase text-[10px] tracking-widest shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                    Neural Engine / Predictive Search
                </div>
                <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white">Oracle Search</h2>
                <p className="text-zinc-500 text-xl font-medium max-w-2xl">
                    Search for job listings across the web instantly, powered by Firecrawl AI.
                </p>
            </div>

            {/* Search Box */}
            <div className="bg-zinc-950 p-2 border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] transition-all hover:shadow-[8px_8px_0px_0px_rgba(105,240,174,0.2)]">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 p-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Job title, keywords, or company..."
                            className="w-full bg-black border-4 border-black pl-12 pr-4 py-4 text-white font-bold text-lg focus:outline-none focus:bg-zinc-900 placeholder:text-zinc-800 transition-all shadow-inner"
                        />
                    </div>
                    <div className="relative flex-1 md:max-w-[300px]">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Location (optional)..."
                            className="w-full bg-black border-4 border-black pl-12 pr-4 py-4 text-white font-bold text-lg focus:outline-none focus:bg-zinc-900 placeholder:text-zinc-800 transition-all shadow-inner"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-white text-black px-10 py-4 border-4 border-black font-black uppercase text-sm tracking-[0.2em] hover:bg-[#69f0ae] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-5 h-5" /> Execute</>}
                    </button>
                </form>
            </div>

            {/* Results section */}
            <div className="space-y-8">
                {error && (
                    <div className="bg-[#ff5252]/10 border-4 border-[#ff5252] text-[#ff5252] p-4 font-black uppercase text-xs">
                        Error: {error}
                    </div>
                )}

                <div className="grid gap-6">
                    {jobs.map((job, idx) => (
                        <div key={idx} className="relative bg-zinc-950 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)] hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.15)] hover:-translate-y-1 transition-all group flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="space-y-4 flex-1">
                                <div className="flex flex-wrap items-center gap-4">
                                    <h3 className="text-2xl font-black uppercase tracking-tight text-white group-hover:text-[#69f0ae] transition-colors">
                                        {job.title}
                                    </h3>
                                    <div className="bg-black border-2 border-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#69f0ae] flex items-center gap-2">
                                        <Globe className="w-3 h-3" /> {job.source}
                                    </div>
                                </div>
                                <p className="text-zinc-500 text-lg font-medium line-clamp-2 leading-relaxed max-w-4xl">
                                    {job.snippet}
                                </p>
                            </div>
                            <a
                                href={job.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white text-black px-8 py-4 border-4 border-black font-black uppercase text-xs tracking-widest hover:bg-[#448aff] hover:text-white transition-all flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                            >
                                Apply Now
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    ))}
                    
                    {!isLoading && jobs.length === 0 && !error && (
                        <div className="py-24 text-center border-4 border-dashed border-zinc-800 flex flex-col items-center gap-6">
                           <div className="bg-zinc-900 border-2 border-zinc-800 w-20 h-20 rounded-none flex items-center justify-center rotate-45">
                                <Briefcase className="w-10 h-10 text-zinc-700 -rotate-45" />
                           </div>
                           <div>
                                <p className="text-zinc-500 font-black uppercase tracking-[0.3em]">No data records matching query</p>
                                <p className="text-zinc-600 text-sm mt-3 font-medium">Try broader keywords or different location vectors.</p>
                           </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function JobsPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>}>
            <JobSearchContent />
        </Suspense>
    )
}
