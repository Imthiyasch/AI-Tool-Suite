'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, CheckCircle2, Search, Loader2, Sparkles, User, GraduationCap, Briefcase } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { TiltCard } from '@/components/ui/TiltCard'

export default function ResumeAnalyzerPage() {
    const [file, setFile] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [analysis, setAnalysis] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0])
            setError(null)
        }
    }

    const handleAnalyze = async () => {
        if (!file) return

        setIsLoading(true)
        setError(null)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('/api/resume/analyze', {
                method: 'POST',
                body: formData,
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setAnalysis(data.analysis)
        } catch (err: any) {
            setError(err.message || 'Failed to analyze resume')
        } finally {
            setIsLoading(false)
        }
    }

    const handleFindJobs = () => {
        if (!analysis?.targetRoles?.[0]) return
        const role = analysis.targetRoles[0]
        router.push(`/dashboard/jobs?q=${encodeURIComponent(role)}`)
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20 font-sans">
            <div className="space-y-4">
                <div className="inline-block bg-[#448aff] text-white px-4 py-1 border-2 border-black font-black uppercase text-[10px] tracking-widest shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                    Neural Engine / Profile Extraction
                </div>
                <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white">Resume AI</h2>
                <p className="text-zinc-500 text-xl font-medium max-w-2xl">
                    Synthesize your professional DNA. Extract skills, roles, and match with the global grid.
                </p>
            </div>

            {/* Upload Section */}
            {!analysis && (
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                        mt-10 border-4 border-black p-16 text-center cursor-pointer transition-all bg-zinc-950 shadow-[10px_10px_0px_0px_rgba(255,255,255,0.05)]
                        ${file ? 'border-[#69f0ae] bg-[#69f0ae]/5 shadow-[10px_10px_0px_0px_rgba(105,240,174,0.2)]' : 'hover:border-white hover:bg-zinc-900'}
                    `}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept=".pdf,.docx,.txt"
                    />
                    <div className="flex flex-col items-center gap-6">
                        <div className={`p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${file ? 'bg-[#69f0ae] text-black' : 'bg-white text-black'}`}>
                            {file ? <CheckCircle2 className="w-10 h-10" /> : <Upload className="w-10 h-10" />}
                        </div>
                        <div>
                            <p className="text-2xl font-black uppercase italic tracking-tight text-white">
                                {file ? file.name : 'Inject Resume Data'}
                            </p>
                            <p className="text-zinc-600 mt-2 font-bold uppercase text-xs tracking-widest">PDF / DOCX / TXT Protocol Supported</p>
                        </div>
                        {file && (
                            <button
                                onClick={(e) => { e.stopPropagation(); handleAnalyze(); }}
                                disabled={isLoading}
                                className="mt-8 bg-[#ffeb3b] text-black px-12 py-5 border-4 border-black font-black uppercase text-lg tracking-[0.2em] hover:bg-white transition-all active:scale-95 disabled:opacity-50 flex items-center gap-4 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
                            >
                                {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : <><Sparkles className="w-8 h-8" /> Execute Analysis</>}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-[#ff5252]/10 border-4 border-[#ff5252] text-[#ff5252] p-6 font-black uppercase text-xs">
                    Protocol Error: {error}
                </div>
            )}

            {/* Analysis Results */}
            {analysis && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        
                        {/* Match Score Gauge - NEW */}
                        <TiltCard className="bg-zinc-950 border-4 border-black p-10 shadow-[12px_12px_0px_0px_rgba(255,235,59,0.1)] flex flex-col items-center justify-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#ffeb3b] opacity-5 -mr-12 -mt-12 rotate-45 group-hover:scale-150 transition-transform duration-700" />
                            <h4 className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px] mb-8">Neural Match Score</h4>
                            <div className="relative w-48 h-48 flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-zinc-900" />
                                    <circle 
                                        cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" 
                                        strokeDasharray={552.92}
                                        strokeDashoffset={552.92 * (1 - (analysis.matchScore || 0) / 100)}
                                        className="text-[#69f0ae] transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-black text-white italic">{analysis.matchScore}%</span>
                                    <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mt-1">Profile Strength</span>
                                </div>
                            </div>
                            <div className="mt-8 text-center">
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                                    Status: <span className="text-[#69f0ae]">{analysis.matchScore > 80 ? 'Optimal' : analysis.matchScore > 60 ? 'Healthy' : 'Needs Optimization'}</span>
                                </p>
                            </div>
                        </TiltCard>

                        {/* Profile Info */}
                        <div className="lg:col-span-2 space-y-10">
                            <TiltCard className="bg-zinc-950 border-4 border-black p-10 shadow-[12px_12px_0px_0px_rgba(255,255,255,0.05)] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#69f0ae] opacity-5 -mr-16 -mt-16 rotate-45" />
                                
                                <div className="flex items-center gap-6 border-b-4 border-black pb-8 mb-8">
                                    <div className="bg-[#69f0ae] text-black p-5 border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
                                        <User className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">{analysis.name}</h3>
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="px-3 py-1 bg-black border-2 border-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                                <Briefcase className="w-3 h-3" /> {analysis.experienceYears} Years Exp.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[#69f0ae] font-black uppercase tracking-[0.2em] text-[10px]">
                                        Neural Summary / Content
                                    </h4>
                                    <p className="text-zinc-400 leading-relaxed text-xl font-medium italic">
                                        "{analysis.summary}"
                                    </p>
                                </div>
                            </TiltCard>

                            <div className="bg-zinc-950 border-4 border-black p-10 shadow-[12px_12px_0px_0px_rgba(255,255,255,0.05)]">
                                <h4 className="text-[#448aff] font-black uppercase tracking-[0.2em] text-[10px] mb-8 flex items-center gap-3">
                                   <GraduationCap className="w-5 h-5" /> Academic Records
                                </h4>
                                <ul className="grid gap-4">
                                    {analysis.education?.map((edu: string, idx: number) => (
                                        <li key={idx} className="flex items-center gap-4 text-white font-bold bg-black p-5 border-2 border-white/5">
                                            <div className="w-3 h-3 bg-[#448aff] border-2 border-black" />
                                            {edu}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Skills & Roles */}
                        <div className="lg:w-1/3 space-y-10">
                            <div className="bg-zinc-950 border-4 border-black p-10 shadow-[8px_8px_0px_0px_rgba(105,240,174,0.1)]">
                                <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] mb-6">Skill Matrix</h4>
                                <div className="flex flex-wrap gap-3">
                                    {analysis.skills?.map((skill: string, idx: number) => (
                                        <span key={idx} className="bg-white text-black border-2 border-black px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-[#69f0ae] transition-colors">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleFindJobs}
                                className="w-full bg-[#69f0ae] text-black p-6 border-4 border-black font-black uppercase text-sm tracking-[0.2em] hover:bg-white transition-all shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex items-center justify-center gap-4 italic active:scale-95"
                            >
                                <Search className="w-6 h-6" /> Find Match Jobs
                            </button>

                            {/* Optimization Vectors - NEW */}
                            <div className="bg-zinc-950 border-4 border-black p-10 shadow-[12px_12px_0px_0px_rgba(255,82,82,0.1)]">
                                <h4 className="text-[#ff5252] font-black uppercase tracking-[0.2em] text-[10px] mb-6 flex items-center gap-3">
                                   <Sparkles className="w-5 h-5" /> Optimization Vectors
                                </h4>
                                <div className="space-y-4">
                                    {analysis.improvementPoints?.map((point: string, idx: number) => (
                                        <div key={idx} className="flex gap-4 group">
                                            <div className="w-2 h-2 mt-2 bg-[#ff5252] border-2 border-black flex-shrink-0 group-hover:scale-125 transition-transform" />
                                            <p className="text-zinc-400 text-sm font-medium leading-relaxed group-hover:text-white transition-colors">{point}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <button
                                onClick={() => { setAnalysis(null); setFile(null); }}
                                className="w-full bg-black text-zinc-600 border-4 border-black p-4 font-black uppercase text-[10px] tracking-widest hover:text-white transition-all"
                            >
                                Reset Analysis Protocol
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
