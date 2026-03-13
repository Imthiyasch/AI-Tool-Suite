'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { redirect, usePathname } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Search, Youtube, LogOut, Menu, X } from 'lucide-react'

interface User {
    id: string;
    email?: string;
    user_metadata: {
        full_name?: string;
        avatar_url?: string;
    }
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const pathname = usePathname()
    const lastPathname = useRef(pathname)
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                redirect('/')
            }
            setUser(user)
            setLoading(false)
        }
        checkUser()
    }, [])

    // Close sidebar on navigation (mobile)
    useEffect(() => {
        if (pathname !== lastPathname.current) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsSidebarOpen(false)
            lastPathname.current = pathname
        }
    }, [pathname])

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#ffeb3b] border-t-transparent rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="min-h-screen bg-black text-white flex selection:bg-[#ffeb3b] selection:text-black overflow-hidden h-screen">
            {/* Neo-Brutalist Grid Background */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.1]" 
                 style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:relative z-50 w-72 h-full border-r-4 border-black bg-zinc-950 flex flex-col shadow-[4px_0px_0px_0px_rgba(255,255,255,0.1)] transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="p-8 border-b-4 border-black bg-white text-black flex items-center justify-between">
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none">Brevio<br/>Lumio</h2>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
                        <X className="w-8 h-8" />
                    </button>
                </div>

                <nav className="flex-1 p-6 flex flex-col gap-3 overflow-y-auto">
                    {[
                        { href: '/dashboard/notes', label: 'Smart Notes', icon: BookOpen, color: '#ffeb3b' },
                        { href: '/dashboard/summarizer', label: 'YT Pulse', icon: Youtube, color: '#b388ff' },
                        { href: '/dashboard/jobs', label: 'Oracle Search', icon: Search, color: '#69f0ae' },
                    ].map((item) => (
                        <Link 
                            key={item.href}
                            href={item.href} 
                            className={`flex items-center gap-4 px-4 py-4 font-black uppercase text-xs tracking-[0.2em] border-2 border-transparent transition-all rounded-none ${pathname === item.href ? `bg-[${item.color}] text-black border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]` : 'text-zinc-400 hover:border-black hover:bg-zinc-900 group'}`}
                            style={{ backgroundColor: pathname === item.href ? item.color : '' }}
                        >
                            <item.icon className={`w-5 h-5 ${pathname === item.href ? 'text-black' : 'group-hover:text-white'}`} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t-4 border-black bg-zinc-900">
                    {user && (
                        <div className="flex items-center gap-4 mb-6 p-3 border-2 border-white/10">
                            {user.user_metadata?.avatar_url ? (
                                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-10 h-10 border-2 border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]" />
                            ) : (
                                <div className="w-10 h-10 bg-[#ffeb3b] text-black border-2 border-black flex items-center justify-center font-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                                    {user.email?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-black text-white uppercase truncate tracking-widest">
                                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                                </p>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase">Pro Member</p>
                            </div>
                        </div>
                    )}

                    <button 
                        onClick={async () => {
                            await supabase.auth.signOut()
                            window.location.href = '/'
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-widest text-[#ff5252] border-2 border-[#ff5252]/20 hover:border-[#ff5252] hover:bg-[#ff5252]/10 transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="relative z-10 flex-1 overflow-auto flex flex-col h-full bg-black">
                <header className="h-20 border-b-4 border-black flex items-center justify-between px-6 md:px-10 bg-black/50 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 border-2 border-black bg-[#ffeb3b] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse hidden sm:block" />
                        <h1 className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-zinc-400">
                            <span className="hidden xs:inline">Neutral Network / </span><span className="text-white">Active</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-6">
                         <div className="hidden lg:flex items-center gap-2 px-4 py-2 border-2 border-white/5 text-[10px] font-black uppercase text-zinc-500">
                            System Status: <span className="text-[#69f0ae]">Optimal</span>
                         </div>
                    </div>
                </header>
                <div className="flex-1 p-6 md:p-10 relative">
                     {/* Page Decorative Plus Signs */}
                     <div className="absolute top-10 right-10 text-zinc-800 pointer-events-none select-none hidden md:block">
                        <div className="flex gap-4 opacity-20">
                            {Array.from({length: 10}).map((_, i) => <span key={i}>+</span>)}
                        </div>
                     </div>
                    {children}
                </div>
            </main>
        </div>
    )
}

