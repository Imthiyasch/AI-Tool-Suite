"use client";

import { useState } from "react";
import { Loader2, Youtube, List, FileText, Network, Star } from "lucide-react";
import { saveSummaryAsNote } from "./actions";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Mermaid from '../../../components/ui/Mermaid';

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
            // Save everything combined
            const combinedContent = `# YouTube Summary\n\n## Summary\n${data.summary}\n\n## Script Outline\n${data.transcript}\n\n## Mindmap Data\n\`\`\`mermaid\n${data.mindmap}\n\`\`\``;
            const res = await saveSummaryAsNote(combinedContent);
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
                            className="block w-full pl-12 pr-4 py-5 border-4 border-black bg-zinc-900 text-white placeholder-zinc-600 focus:outline-none focus:bg-zinc-800 transition-all font-bold text-lg"
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
                <div className="mt-12 border-4 border-black bg-zinc-950 overflow-hidden shadow-[12px_12px_0px_0px_rgba(179,136,255,0.2)]">
                    {/* Video Info Preview */}
                    <div className="p-6 bg-zinc-900 border-b-4 border-black flex items-center gap-6">
                        <div className="flex-shrink-0 w-32 md:w-48 aspect-video border-2 border-black bg-black relative group overflow-hidden">
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
                            <h3 className="text-xl md:text-3xl font-black uppercase text-white leading-tight mb-2">{data.title}</h3>
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{url}</p>
                        </div>
                    </div>

                    {/* Header and Save Button */}
                    <div className="p-4 border-b-4 border-black flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-zinc-900">
                        <div className="flex overflow-x-auto w-full xl:w-auto bg-black p-1 border-2 border-white/10 no-scrollbar">
                            <button
                                onClick={() => setActiveTab('summary')}
                                className={activeTab === 'summary' ? "flex items-center gap-3 px-6 py-3 text-xs font-black uppercase tracking-widest transition-all bg-[#ffeb3b] text-black border-2 border-black whitespace-nowrap" : "flex items-center gap-3 px-6 py-3 text-xs font-black uppercase tracking-widest transition-all text-zinc-500 hover:text-white whitespace-nowrap"}
                            >
                                <List className="w-4 h-4" />
                                Summary
                            </button>
                            <button
                                onClick={() => setActiveTab('thread')}
                                className={activeTab === 'thread' ? "flex items-center gap-3 px-6 py-3 text-xs font-black uppercase tracking-widest transition-all bg-[#ff5252] text-white border-2 border-black whitespace-nowrap" : "flex items-center gap-3 px-6 py-3 text-xs font-black uppercase tracking-widest transition-all text-zinc-500 hover:text-white whitespace-nowrap"}
                            >
                                <Star className="w-4 h-4" />
                                Thread
                            </button>
                            <button
                                onClick={() => setActiveTab('mindmap')}
                                className={activeTab === 'mindmap' ? "flex items-center gap-3 px-6 py-3 text-xs font-black uppercase tracking-widest transition-all bg-[#69f0ae] text-black border-2 border-black whitespace-nowrap" : "flex items-center gap-3 px-6 py-3 text-xs font-black uppercase tracking-widest transition-all text-zinc-500 hover:text-white whitespace-nowrap"}
                            >
                                <Network className="w-4 h-4" />
                                Mindmap
                            </button>
                            <button
                                onClick={() => setActiveTab('transcript')}
                                className={activeTab === 'transcript' ? "flex items-center gap-3 px-6 py-3 text-xs font-black uppercase tracking-widest transition-all bg-[#448aff] text-white border-2 border-black whitespace-nowrap" : "flex items-center gap-3 px-6 py-3 text-xs font-black uppercase tracking-widest transition-all text-zinc-500 hover:text-white whitespace-nowrap"}
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
                            <div className="prose prose-invert max-w-none prose-h2:text-4xl prose-h2:font-black prose-h2:uppercase prose-h2:tracking-tighter prose-h2:mb-8 prose-p:text-zinc-400 prose-p:text-lg prose-li:text-zinc-400 prose-zinc prose-headings:text-white">
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
                                    <div key={i} className="relative p-8 bg-zinc-900 border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,82,82,0.3)] group hover:shadow-[8px_8px_0px_0px_rgba(255,82,82,0.5)] transition-all">
                                        <div className="absolute -top-4 -left-4 w-10 h-10 bg-[#ff5252] border-2 border-black flex items-center justify-center font-black text-white italic">
                                            {i + 1}
                                        </div>
                                        <p className="text-xl md:text-2xl font-bold leading-relaxed text-white pr-8 italic">
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
