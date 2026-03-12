'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Youtube, BookOpen, Search, FileText, MoveRight, Zap, Star, MessageSquare } from 'lucide-react'

export default function Home() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e: React.MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY })
    }

    const handleGoogleLogin = async () => {
        const supabase = createClient()
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
    }

    return (
        <div 
            onMouseMove={handleMouseMove}
            className="relative min-h-screen bg-[#000000] text-white selection:bg-[#ffeb3b] selection:text-black overflow-x-hidden font-sans pt-6 md:pt-12"
        >
            
            {/* Immersive Neural Gradient (Mouse Follow) */}
            <div 
                className="pointer-events-none fixed inset-0 z-10 opacity-30 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(105, 240, 174, 0.15), transparent 80%)`
                }}
            />

            {/* Neo-Brutalist Grid Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.15]" 
                 style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {/* Navigation */}
            <nav className="relative z-50 flex items-center justify-between w-[calc(100%-2rem)] max-w-6xl px-6 md:px-8 mx-auto bg-white text-black py-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] mb-12 md:mb-20 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-4">
                    <span className="text-xl md:text-2xl font-black italic tracking-tighter">BREVIO LUMIO</span>
                </div>
                
                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8 font-black uppercase text-sm tracking-widest">
                    <span className="hover:underline cursor-pointer">Product</span>
                    <span className="hover:underline cursor-pointer">Solutions</span>
                    <span className="hover:underline cursor-pointer">Pricing</span>
                    <span className="hover:underline cursor-pointer">About</span>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <button onClick={handleGoogleLogin} className="font-black text-sm uppercase hover:underline">Log In</button>
                    <button onClick={handleGoogleLogin} className="bg-black text-white px-6 py-2 rounded-full font-black text-sm uppercase transition-transform active:scale-95">Free Trial</button>
                </div>

                {/* Mobile Menu Button */}
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 border-2 border-black active:scale-90 transition-transform"
                >
                    <div className="space-y-1">
                        <div className={`w-6 h-1 bg-black transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <div className={`w-6 h-1 bg-black transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
                        <div className={`w-6 h-1 bg-black transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </div>
                </button>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white border-4 border-black border-t-0 p-8 flex flex-col gap-6 md:hidden animate-in slide-in-from-top-2 duration-200 z-50 shadow-[0px_10px_0px_0px_rgba(0,0,0,1)]">
                        <div className="flex flex-col gap-4 font-black uppercase text-lg">
                            <span className="hover:bg-[#ffeb3b] p-2">Product</span>
                            <span className="hover:bg-[#ffeb3b] p-2">Solutions</span>
                            <span className="hover:bg-[#ffeb3b] p-2">Pricing</span>
                            <span className="hover:bg-[#ffeb3b] p-2">About</span>
                        </div>
                        <div className="h-1 bg-black" />
                        <button onClick={handleGoogleLogin} className="bg-black text-white py-4 font-black uppercase tracking-widest">Connect Wallet</button>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 w-full max-w-7xl px-6 mx-auto flex flex-col items-center">
                
                {/* Floating Elements Area */}
                <div className="relative w-full h-[600px] flex flex-col items-center justify-center">
                    
                    {/* Top Floating Bubble: Yellow */}
                    <div className="absolute top-0 left-[10%] group animate-bounce-subtle">
                        <div className="bg-[#ffeb3b] text-black p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] max-w-[180px]">
                            <p className="font-black text-xs leading-tight">No more tab chaos!</p>
                            <div className="mt-2 flex items-center gap-2">
                                <img src="https://i.pravatar.cc/150?u=olivia" className="w-6 h-6 rounded-full border-2 border-black" alt="" />
                                <span className="text-[10px] font-black uppercase bg-[#ff5252] text-white px-1">Olivia</span>
                            </div>
                        </div>
                    </div>

                    {/* Top Center: Work Smarter Label */}
                    <div className="mb-12 border-4 border-dashed border-zinc-600 px-10 py-4">
                        <span className="text-2xl md:text-3xl font-black uppercase tracking-widest text-[#69f0ae]">Work smarter, not harder</span>
                    </div>

                    {/* Top Right Floating Bubble: Purple */}
                    <div className="absolute top-[10%] right-[15%] group animate-float-slow">
                        <div className="bg-[#b388ff] text-black w-24 h-24 rounded-full border-4 border-black flex items-center justify-center p-4 text-center shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                            <p className="font-black text-[10px] leading-tight">Finally, a calendar that says &apos;no&apos; for you!</p>
                        </div>
                        <div className="mt-2 flex items-center gap-2 justify-end mr-4">
                            <img src="https://i.pravatar.cc/150?u=danniel" className="w-6 h-6 rounded-full border-2 border-black" alt="" />
                            <span className="text-[10px] font-black uppercase bg-[#69f0ae] text-black px-1">Danniel</span>
                        </div>
                    </div>

                    {/* Responsive Neural Logo */}
                    <h1 className="text-[18vw] md:text-[min(14vw,14rem)] font-black leading-none uppercase tracking-[-0.05em] text-center" 
                        style={{ WebkitTextStroke: 'clamp(2px, 0.4vw, 4px) white', color: 'transparent', paintOrder: 'fill stroke' }}>
                        BREVIO<br />LUMIO
                    </h1>

                    {/* Social Proof Text */}
                    <div className="mt-8 md:mt-12 text-center max-w-lg px-6">
                        <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-8">Chaos, meet your match!</h2>
                    </div>

                    {/* Bottom Feature Shapes - Optimized for Mobile */}
                    <div className="absolute bottom-[2%] md:bottom-[5%] left-[2%] md:left-[5%] flex flex-wrap gap-2 md:gap-4 max-w-[200px] md:max-w-sm">
                        <div className="bg-[#448aff] text-white px-4 md:px-6 py-1 md:py-2 border-2 md:border-4 border-black rounded-full font-black text-[10px] md:text-sm whitespace-nowrap -rotate-3 transition-transform hover:rotate-0">
                            Automated Tasks
                        </div>
                        <div className="bg-[#ff5252] text-white px-4 md:px-6 py-2 md:py-3 border-2 md:border-4 border-black rounded-lg font-black text-[10px] md:text-xs max-w-[100px] md:max-w-[120px] rotate-3 transition-transform hover:rotate-0">
                            Neural Engine
                        </div>
                    </div>

                    {/* Features Cluster: Right - Hidden on very small screens or optimized */}
                    <div className="absolute bottom-[2%] md:bottom-[5%] right-[2%] md:right-[5%] hidden md:flex flex-wrap gap-4 justify-end">
                        <div className="bg-[#ffeb3b] text-black px-8 py-4 border-4 border-black rounded-xl font-black text-sm rotate-6 transition-transform hover:rotate-0 flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                            Meeting Automation
                        </div>
                        <div className="bg-[#69f0ae] text-black px-6 py-3 border-4 border-black rounded-full font-black text-xs -rotate-2 transition-transform hover:rotate-0">
                            Self-Learning Fit
                        </div>
                    </div>

                    {/* Decorative Stars */}
                    <div className="absolute top-[35%] md:top-[40%] right-[5%] md:right-[10%] text-[#ff5252] animate-spin-slow scale-75 md:scale-100">
                        <Star className="w-12 h-12 md:w-16 md:w-16 fill-[#ff5252]" />
                    </div>
                </div>

                {/* Neural Ticker - NEW */}
                <div className="w-full bg-white border-y-4 border-black py-4 overflow-hidden relative z-20 group">
                    <div className="flex animate-ticker whitespace-nowrap">
                        {Array.from({length: 10}).map((_, i) => (
                            <div key={i} className="flex items-center gap-12 px-6">
                                <span className="text-black font-black uppercase text-xl md:text-2xl flex items-center gap-4">
                                    <Zap className="w-6 h-6 fill-black" /> Neural Processing: Active
                                </span>
                                <span className="text-black font-black uppercase text-xl md:text-2xl flex items-center gap-4">
                                    <Star className="w-6 h-6 fill-black" /> Efficiency: +42%
                                </span>
                                <span className="text-black font-black uppercase text-xl md:text-2xl flex items-center gap-4 text-[#ff5252]">
                                    <MessageSquare className="w-6 h-6 fill-black" /> Brevio AI: Online
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Section: Resolved Intro - Optimized for Stacking */}
                <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 md:gap-20 py-20 md:py-40 border-t-4 border-zinc-900 mt-12 md:mt-20 px-6">
                    <div className="space-y-6 md:space-y-8">
                        <div className="w-16 md:w-20 h-2 bg-[#ffeb3b]" />
                        <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-xs">Synthetic Intelligence</p>
                        <h3 className="text-4xl md:text-6xl font-black uppercase italic leading-none">Your Productivity,<br /><span className="text-[#ffeb3b]">Refined.</span></h3>
                    </div>
                    <div className="flex flex-col justify-end">
                        <p className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed mb-8 md:mb-12">
                            Brevio Lumio is an AI-powered productivity software that automates tasks, prioritizes ruthlessly, and focuses on what matters. Powered by AI that learns your workflow.
                        </p>
                        <div className="flex flex-wrap gap-2 text-zinc-800">
                             {Array.from({length: 20}).map((_, i) => (
                                <span key={i} className="text-xl">+</span>
                             ))}
                        </div>
                    </div>
                </div>

                {/* Primary CTA Area */}
                <section className="w-full bg-[#ffeb3b] text-black py-20 px-6 md:px-8 border-t-8 border-black flex flex-col items-center gap-8 mb-20 md:mb-40 shadow-[0px_-20px_50px_rgba(255,235,59,0.2)]">
                    <h2 className="text-4xl md:text-8xl font-black uppercase tracking-tighter text-center italic leading-tight">Ready to stop the chaos?</h2>
                    <button onClick={handleGoogleLogin} className="group bg-black text-white py-5 md:py-6 px-10 md:px-16 rounded-full font-black text-xl md:text-2xl uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none">
                        Get Started Now
                    </button>
                </section>

            </main>

            <style jsx global>{`
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0px) rotate(-3deg); }
                    50% { transform: translateY(-10px) rotate(-3deg); }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-float-slow {
                    animation: float-slow 6s ease-in-out infinite;
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 4s ease-in-out infinite;
                }
                .animate-spin-slow {
                    animation: spin-slow 12s linear infinite;
                }
                .animate-ticker {
                    animation: ticker 40s linear infinite;
                }
            `}</style>
        </div>
    )
}
