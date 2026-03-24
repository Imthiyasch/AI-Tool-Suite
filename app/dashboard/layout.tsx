'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { redirect, usePathname } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Search, Youtube, LogOut, Menu, X, ShieldAlert, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'

interface User {
    id: string;
    email?: string;
    user_metadata: {
        full_name?: string;
        avatar_url?: string;
        is_admin?: boolean;
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
    const { theme, setTheme } = useTheme()

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
        <div className="min-h-screen flex selection:bg-accent-blue overflow-hidden h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}>
            {/* Soft Grid Background */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.1]" 
                 style={{ backgroundImage: 'linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:relative z-50 w-72 h-full flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`} style={{ backgroundColor: 'var(--bg-surface)', borderRight: '1px solid var(--border-color)', boxShadow: 'var(--glass-shadow)' }}>
                <div className="p-8 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none" style={{ color: 'var(--text-primary)' }}>Brevio<br/>Lumio</h2>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
                        <X className="w-8 h-8" />
                    </button>
                </div>

                <nav className="flex-1 p-6 flex flex-col gap-3 overflow-y-auto">
                    {[
                        { href: '/dashboard/notes', label: 'Smart Notes', icon: BookOpen, color: '#ffeb3b' },
                        { href: '/dashboard/summarizer', label: 'YT Pulse', icon: Youtube, color: '#b388ff' },
                        { href: '/dashboard/research', label: 'AI Research', icon: Search, color: '#448aff' },
                        ...(user?.user_metadata?.is_admin ? [{ href: '/dashboard/admin', label: 'Admin Panel', icon: ShieldAlert, color: '#ff5252' }] : [])
                    ].map((item) => (
                        <Link 
                            key={item.href}
                            href={item.href} 
                            className={`flex items-center gap-4 px-4 py-4 font-bold uppercase text-xs tracking-[0.15em] transition-all rounded-xl ${pathname === item.href ? `shadow-sm` : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 group'}`}
                            style={pathname === item.href ? { backgroundColor: item.color, color: '#000', textShadow: '0 1px 2px rgba(255,255,255,0.2)' } : { color: 'var(--text-primary)' }}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-6" style={{ borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
                    {user && (
                        <div className="flex items-center gap-4 mb-6 p-3 rounded-xl" style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
                            {user.user_metadata?.avatar_url ? (
                                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-10 h-10 rounded-full" style={{ border: '2px solid var(--border-color)' }} />
                            ) : (
                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: 'var(--accent-blue)', color: '#fff' }}>
                                    {user.email?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold uppercase truncate tracking-widest" style={{ color: 'var(--text-primary)' }}>
                                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                                </p>
                                <p className="text-[10px] font-medium uppercase" style={{ color: 'var(--accent-blue)' }}>Pro Member</p>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <button 
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="flex items-center justify-center p-3 rounded-xl transition-all hover:bg-black/5 dark:hover:bg-white/5"
                            style={{ border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                        >
                            {theme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>

                        <button 
                            onClick={async () => {
                                await supabase.auth.signOut()
                                window.location.href = '/'
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
                            style={{ border: '1px solid var(--accent-red)', color: 'var(--accent-red)' }}
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="relative z-10 flex-1 overflow-auto flex flex-col h-full" style={{ backgroundColor: 'var(--bg-page)' }}>
                <header className="h-20 flex items-center justify-between px-6 md:px-10 backdrop-blur-md sticky top-0 z-20" style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)' }}>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg transition-all"
                            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="w-3 h-3 rounded-full animate-pulse hidden sm:block" style={{ backgroundColor: 'var(--accent-blue)' }} />
                        <h1 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] opacity-70" style={{ color: 'var(--text-primary)' }}>
                            <span className="hidden xs:inline">Neutral Network / </span><span style={{ color: 'var(--text-primary)' }}>Active</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-6">
                         <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase" style={{ border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                            System Status: <span style={{ color: 'var(--accent-green)' }}>Optimal</span>
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

