'use client'

import { useState } from 'react'
import { Search, ExternalLink, Loader2, Globe, BookOpen, Sparkles, ChevronRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Source {
    title: string
    url: string
    snippet: string
}

export default function ResearchPage() {
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const [sources, setSources] = useState<Source[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [asked, setAsked] = useState('')

    const handleResearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!question.trim()) return
        setIsLoading(true)
        setError(null)
        setAnswer('')
        setSources([])
        setAsked(question)

        try {
            const res = await fetch('/api/research', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question })
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setAnswer(data.answer || '')
            setSources(data.sources || [])
        } catch (err: unknown) {
            setError((err as Error).message || 'Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    const suggestions = [
        'What are the best practices for React performance optimization?',
        'How does quantum computing work?',
        'Latest advancements in AI language models 2024',
        'What is the difference between REST and GraphQL?',
    ]

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20 font-sans">
            {/* Header */}
            <div className="space-y-4">
                <div className="inline-block bg-[#448aff] text-white px-4 py-1 border-2 border-black font-black uppercase text-[10px] tracking-widest shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                    Neural Engine / AI Research
                </div>
                <h2 className="text-5xl font-black uppercase italic tracking-tighter" style={{ color: 'var(--text-primary)' }}>AI Research</h2>
                <p className="text-zinc-500 text-xl font-medium max-w-2xl">
                    Ask anything. Our AI searches the web via Firecrawl and synthesizes a cited answer using Gemini.
                </p>
            </div>

            {/* Search Form */}
            <div className="p-2 glass-panel transition-all">
                <form onSubmit={handleResearch} className="flex flex-col gap-4 p-4">
                    <div className="relative">
                        <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Ask a research question..."
                            className="w-full premium-input pl-12 pr-4 py-5 font-bold text-lg transition-all"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {suggestions.map((s, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setQuestion(s)}
                                className="text-[10px] font-black uppercase tracking-widest text-zinc-600 border border-zinc-800 px-3 py-1 hover:text-[#448aff] hover:border-[#448aff] transition-all"
                            >
                                <ChevronRight className="inline w-3 h-3 mr-1" />{s.slice(0, 40)}...
                            </button>
                        ))}
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !question.trim()}
                        className="self-end bg-white text-black px-10 py-4 border-4 border-black font-black uppercase text-sm tracking-[0.2em] hover:bg-[#448aff] hover:text-white transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-5 h-5" /> Research</>}
                    </button>
                </form>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-[#ff5252]/10 border-4 border-[#ff5252] text-[#ff5252] p-4 font-black uppercase text-xs">
                    Error: {error}
                </div>
            )}

            {/* Loading state */}
            {isLoading && (
                <div className="flex flex-col items-center gap-6 py-16 border-4 border-dashed border-zinc-800">
                    <Loader2 className="w-12 h-12 animate-spin text-[#448aff]" />
                    <div className="text-center">
                        <p className="font-black uppercase tracking-widest text-[#448aff]">Researching...</p>
                        <p className="text-zinc-600 text-sm mt-2 font-medium">Searching the web and synthesizing an answer</p>
                    </div>
                </div>
            )}

            {/* Results */}
            {answer && !isLoading && (
                <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Answer Panel */}
                    <div className="lg:col-span-2 glass-panel">
                        <div className="flex items-center gap-3 p-6" style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
                            <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-blue)' }} />
                            <h3 className="font-black uppercase tracking-widest text-xs" style={{ color: 'var(--accent-blue)' }}>AI Research Answer</h3>
                        </div>
                        <div className="p-8">
                            <p className="font-bold text-xs uppercase tracking-widest mb-6 pb-4" style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>&ldquo;{asked}&rdquo;</p>
                            <div className="prose-custom max-w-none">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown>
                            </div>
                        </div>
                    </div>

                    {/* Sources Panel */}
                    <div className="glass-panel">
                        <div className="flex items-center gap-3 p-6" style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
                            <Globe className="w-5 h-5" style={{ color: 'var(--accent-green)' }} />
                            <h3 className="font-black uppercase tracking-widest text-xs" style={{ color: 'var(--accent-green)' }}>Sources ({sources.length})</h3>
                        </div>
                        <div className="p-4 space-y-4 overflow-y-auto max-h-[600px]">
                            {sources.length > 0 ? sources.map((source, i) => (
                                <a
                                    key={i}
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-4 transition-all group hover:bg-black/5 dark:hover:bg-white/5"
                                    style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)' }}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-[10px] font-black text-[#448aff] border border-[#448aff] px-2 py-0.5 flex-shrink-0 mt-0.5">[{i + 1}]</span>
                                        <div className="min-w-0">
                                            <p className="font-black text-xs uppercase tracking-wide transition-colors line-clamp-2" style={{ color: 'var(--text-primary)' }}>{source.title}</p>
                                            <p className="text-zinc-600 text-[10px] mt-1 truncate">{source.url}</p>
                                            <p className="text-zinc-500 text-xs mt-2 leading-relaxed line-clamp-3">{source.snippet}</p>
                                        </div>
                                        <ExternalLink className="w-3 h-3 text-zinc-700 flex-shrink-0 group-hover:text-[#448aff] transition-colors mt-0.5" />
                                    </div>
                                </a>
                            )) : (
                                <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest text-center py-8">No external sources retrieved</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {!answer && !isLoading && !error && (
                <div className="py-24 text-center flex flex-col items-center gap-6 rounded-3xl" style={{ border: '2px dashed var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
                    <div className="w-20 h-20 flex items-center justify-center rotate-45 shadow-sm rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        <Search className="w-10 h-10 -rotate-45" style={{ color: 'var(--text-secondary)' }} />
                    </div>
                    <div>
                        <p className="text-zinc-500 font-black uppercase tracking-[0.3em]">Ask a research question above</p>
                        <p className="text-zinc-600 text-sm mt-3 font-medium">AI will search the web and synthesize a cited answer</p>
                    </div>
                </div>
            )}
        </div>
    )
}
