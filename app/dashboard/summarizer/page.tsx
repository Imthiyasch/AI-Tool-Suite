"use client";

import { useState } from "react";
import { Loader2, Youtube, List, FileText, Network, Star } from "lucide-react";
import { saveSummaryAsNote } from "./actions";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Mermaid from '../../../components/ui/Mermaid';
import { marked } from 'marked';

interface SummarizerData {
    summary: string;
    mindmap: string;
    transcript: string;
    thread: string;
    title: string;
    videoId: string;
}

export default function SummarizerPage() {
    const [url, setUrl] = useState("");
    const [data, setData] = useState<SummarizerData | null>(null);
    const [activeTab, setActiveTab] = useState<'summary' | 'mindmap' | 'transcript' | 'thread'>('summary');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSaveNote = async () => {
        if (!data) return;
        setSaving(true);
        try {
            // Save everything combined as HTML for the new Rich Text Notes Editor
            let combinedContent = `<h2>YouTube Summary</h2><br/><h3>Summary</h3>\n${data.summary}\n<br/><h3>Script Outline</h3>\n${data.transcript}`;
            
            // convert the markdown parts to HTML
            combinedContent = await marked.parse(combinedContent);

            // Add mindmap as a raw mermaid block for later rendering or text
            const finalString = `${combinedContent}<br/><h3>Mindmap Data</h3><pre><code>${data.mindmap}</code></pre>`;

            const res = await saveSummaryAsNote(finalString);
            if (res?.error) throw new Error(res.error);
            setSaved(true);
        } catch (err: unknown) {
            const errorObj = err as Error;
            console.error(errorObj);
            alert("Failed to save note: " + errorObj.message);
        } finally {
            setSaving(false);
        }
    };

    const handleSummarize = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setData(null);
        setSaved(false);
        setActiveTab('summary');

        try {
            const res = await fetch("/api/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            const responseData = await res.json();

            if (!res.ok) {
                throw new Error(responseData.error || "Failed to generate video data");
            }

            setData({
                summary: responseData.summary,
                mindmap: responseData.mindmap,
                transcript: responseData.transcript,
                thread: responseData.thread,
                title: responseData.title,
                videoId: responseData.videoId
            });
        } catch (err: unknown) {
            const errorObj = err as Error;
            setError(errorObj.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20 font-sans">
            <div className="space-y-4">
                <div className="inline-block bg-[#b388ff] text-black px-4 py-1 border-2 border-black font-black uppercase text-[10px] tracking-widest shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                    Neural Engine / Summarizer
                </div>
                <h2 className="text-5xl font-black uppercase italic tracking-tighter">YT Pulse</h2>
                <p className="text-zinc-500 text-xl font-medium max-w-2xl">
                    Instantly synthesize videos into key takeaways, structural scripts, and interactive mindmaps.
                </p>
            </div>

            <form onSubmit={handleSummarize} className="space-y-6">
                <div className="flex flex-col gap-6 sm:flex-row">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Youtube className="h-6 w-6 text-red-500" />
                        </div>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="block w-full premium-input pl-12 pr-4 py-5 font-bold text-lg"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !url}
                        className="inline-flex items-center justify-center px-10 py-5 border-4 border-black text-xl font-black uppercase tracking-widest bg-white text-black hover:bg-[#ffeb3b] transition-all active:scale-95 disabled:opacity-50 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin -ml-1 mr-3 h-6 w-6" />
                                Processing
                            </>
                        ) : (
                            'Analyze'
                        )}
                    </button>
                </div>
                {error && <div className="p-4 bg-red-500/10 border-2 border-red-500 rounded-none"><p className="text-red-500 font-black uppercase text-xs">{error}</p></div>}
            </form>

            {data && (
                <div className="mt-12 glass-panel overflow-hidden">
                    {/* Video Info Preview */}
                    <div className="p-6 flex items-center gap-6" style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
                        <div className="flex-shrink-0 w-32 md:w-48 aspect-video relative group overflow-hidden rounded-xl" style={{ border: '2px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
                            <img 
                                src={`https://img.youtube.com/vi/${data.videoId}/mqdefault.jpg`} 
                                alt="Thumbnail"
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Youtube className="w-10 h-10 text-red-600 fill-red-600" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl md:text-3xl font-black uppercase leading-tight mb-2" style={{ color: 'var(--text-primary)' }}>{data.title}</h3>
                            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>{url}</p>
                        </div>
                    </div>

                    {/* Header and Save Button */}
                    <div className="p-4 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6" style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
                        <div className="flex overflow-x-auto w-full xl:w-auto p-1 rounded-xl no-scrollbar" style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
                            <button
                                onClick={() => setActiveTab('summary')}
                                className={activeTab === 'summary' ? "flex items-center gap-3 px-6 py-3 text-xs font-black uppercase tracking-widest transition-all bg-[#ffeb3b] text-black rounded-lg whitespace-nowrap shadow-sm" : "flex items-center gap-3 px-6 py-3 text-xs font-black uppercase tracking-widest transition-all hover:text-[#ffeb3b] whitespace-nowrap"}
                                style={activeTab !== 'summary' ? { color: 'var(--text-secondary)' } : {}}
                            >
                                <List className="w-4 h-4" />
                                Summary
                            </button>
                            <button
                                onClick={() => setActiveTab('thread')}
                                className={activeTab === 'thread' ? "flex items-center gap-3 px-6 py-3 text-xs font-black uppercase tracking-widest transition-all bg-[#ff5252] text-white rounded-lg whitespace-nowrap shadow-sm" : "flex items-center gap-3 px-6 py-3 text-xs font-black uppercase tracking-widest transition-all hover:text-[#ff5252] whitespace-nowrap"}
                                style={activeTab !== 'thread' ? { color: 'var(--text-secondary)' } : {}}
                            >
                                <Star className="w-4 h-4" />
                                Thread
                            </button>
                            <button
                                onClick={() => setActiveTab('mindmap')}
                                className={activeTab === 'mindmap' ? "flex items-center gap-3 px-6 py-3 text-xs font-black uppercase tracking-widest transition-all bg-[#69f0ae] text-black rounded-lg whitespace-nowrap shadow-sm" : "flex items-center gap-3 px-6 py-3 text-xs font-black uppercase tracking-widest transition-all hover:text-[#69f0ae] whitespace-nowrap"}
                                style={activeTab !== 'mindmap' ? { color: 'var(--text-secondary)' } : {}}
                            >
                                <Network className="w-4 h-4" />
                                Mindmap
                            </button>
                            <button
                                onClick={() => setActiveTab('transcript')}
                                className={activeTab === 'transcript' ? "flex items-center gap-3 px-6 py-3 text-xs font-black uppercase tracking-widest transition-all bg-[#448aff] text-white rounded-lg whitespace-nowrap shadow-sm" : "flex items-center gap-3 px-6 py-3 text-xs font-black uppercase tracking-widest transition-all hover:text-[#448aff] whitespace-nowrap"}
                                style={activeTab !== 'transcript' ? { color: 'var(--text-secondary)' } : {}}
                            >
                                <FileText className="w-4 h-4" />
                                Script
                            </button>
                        </div>

                        <button
                            onClick={handleSaveNote}
                            disabled={saving || saved}
                            className="bg-white text-black px-8 py-3 border-4 border-black font-black uppercase text-xs tracking-widest hover:bg-[#ffeb3b] transition-all disabled:opacity-50 flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                        >
                            {saving ? (
                                <><Loader2 className="w-4 h-4 animate-spin"/> Saving</>
                            ) : saved ? (
                                "Synced ✓"
                            ) : (
                                "Sync to Notes"
                            )}
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="p-10 min-h-[500px] relative">
                        {/* Decorative background logo */}
                        <div className="absolute bottom-10 right-10 opacity-5 pointer-events-none select-none">
                            <h4 className="text-[10rem] font-black italic uppercase leading-none">Brevio</h4>
                        </div>
                        
                        {activeTab === 'summary' && (
                            <div className="prose-custom">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {data.summary}
                                </ReactMarkdown>
                            </div>
                        )}

                        {activeTab === 'mindmap' && (
                            <div className="flex flex-col items-center justify-center min-h-[400px] bg-white/5 border-2 border-white/5 p-8">
                                {data.mindmap ? (
                                    <div className="w-full h-full invert opacity-90 brightness-150">
                                        <Mermaid chart={data.mindmap} />
                                    </div>
                                ) : (
                                    <p className="text-zinc-500 font-black uppercase tracking-widest">No mindmap generated</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'thread' && (
                            <div className="space-y-12">
                                {data.thread.split('---').map((tweet, i) => (
                                    <div key={i} className="relative p-8 rounded-xl group transition-all" style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
                                        <div className="absolute -top-4 -left-4 w-10 h-10 bg-[#ff5252] rounded-full flex items-center justify-center font-black text-white italic shadow-md">
                                            {i + 1}
                                        </div>
                                        <p className="text-xl md:text-2xl font-bold leading-relaxed pr-8 italic" style={{ color: 'var(--text-primary)' }}>
                                            {tweet.trim()}
                                        </p>
                                        <div className="mt-6 flex items-center justify-between">
                                            <div className="flex gap-4">
                                                <div className="w-8 h-8 rounded-full border-2 border-zinc-800" />
                                                <div className="w-20 h-2 bg-zinc-800 mt-3" />
                                            </div>
                                            <button className="text-[10px] font-black uppercase tracking-widest text-[#ff5252] hover:underline">
                                                Copy Snippet
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
