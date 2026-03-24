import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { Users, FileText, Activity, ShieldAlert, Mail, Calendar, Hash } from 'lucide-react'

export default async function AdminDashboard() {
    const supabase = await createClient()
    
    // Role-gate: only users with is_admin can access
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/')
    if (user.user_metadata?.is_admin !== true) redirect('/dashboard')

    // --- Fetch all users via service_role key (admin API) ---
    let allUsers: any[] = []
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    
    if (serviceRoleKey) {
        const adminClient = createAdminClient(supabaseUrl, serviceRoleKey, {
            auth: { autoRefreshToken: false, persistSession: false }
        })
        const { data: usersData } = await adminClient.auth.admin.listUsers()
        allUsers = usersData?.users || []
    }

    // Fetch notes count per user
    const { data: notesData } = await supabase.from('notes').select('user_id')
    const notesCountByUser: Record<string, number> = {}
    notesData?.forEach(n => {
        notesCountByUser[n.user_id] = (notesCountByUser[n.user_id] || 0) + 1
    })

    // Summary stats
    const totalNotes = notesData?.length || 0
    const totalUsers = allUsers.length

    return (
        <div className="w-full font-sans animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ color: 'var(--text-primary)' }}>
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 pb-4 border-b-4 border-[#ff5252]">
                <ShieldAlert className="w-10 h-10 text-[#ff5252]" />
                <h1 className="text-4xl font-black uppercase tracking-tight text-[#ff5252]">Admin Dashboard</h1>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="glass-panel p-6 border-4 shadow-sm" style={{ borderColor: 'var(--accent-blue)', color: 'var(--text-primary)' }}>
                    <div className="flex items-center gap-4 mb-4">
                        <Users className="w-8 h-8 text-[#448aff]" />
                        <h2 className="text-xl font-black uppercase text-[#448aff]">Total Users</h2>
                    </div>
                    <p className="text-5xl font-black">{totalUsers}</p>
                    <p className="text-sm font-bold text-zinc-500 mt-2 uppercase">Registered accounts</p>
                </div>

                <div className="glass-panel p-6 border-4 shadow-sm" style={{ borderColor: 'var(--accent-yellow)', color: 'var(--text-primary)' }}>
                    <div className="flex items-center gap-4 mb-4">
                        <FileText className="w-8 h-8 text-[#ffeb3b]" />
                        <h2 className="text-xl font-black uppercase text-[#ffeb3b]">Total Notes</h2>
                    </div>
                    <p className="text-5xl font-black">{totalNotes}</p>
                    <p className="text-sm font-bold text-zinc-500 mt-2 uppercase">Across all users</p>
                </div>

                <div className="glass-panel p-6 border-4 shadow-sm" style={{ borderColor: 'var(--accent-green)', color: 'var(--text-primary)' }}>
                    <div className="flex items-center gap-4 mb-4">
                        <Activity className="w-8 h-8 text-[#69f0ae]" />
                        <h2 className="text-xl font-black uppercase text-[#69f0ae]">System Status</h2>
                    </div>
                    <p className="text-3xl font-black text-[#69f0ae]">OPERATIONAL</p>
                    <p className="text-sm font-bold text-zinc-500 mt-4 uppercase">All services online</p>
                </div>
            </div>

            {/* User Table */}
            <div className="glass-panel overflow-hidden">
                <div className="flex items-center gap-3 p-6" style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)' }}>
                    <Users className="w-5 h-5" style={{ color: 'var(--accent-blue)' }} />
                    <h2 className="text-xl font-black uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>All Users</h2>
                    {!serviceRoleKey && (
                        <span className="ml-auto text-[10px] bg-[#ff5252]/20 text-[#ff5252] border border-[#ff5252] px-3 py-1 font-black uppercase tracking-widest">
                            Add SUPABASE_SERVICE_ROLE_KEY to .env.local for full user list
                        </span>
                    )}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-zinc-800">
                                <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500"><Mail className="inline w-3 h-3 mr-2" />Email</th>
                                <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500"><Hash className="inline w-3 h-3 mr-2" />Notes</th>
                                <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500"><Calendar className="inline w-3 h-3 mr-2" />Joined</th>
                                <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Provider</th>
                                <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allUsers.length > 0 ? allUsers.map((u: any) => (
                                <tr key={u.id} className="transition-colors group hover:bg-black/5 dark:hover:bg-white/5" style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 flex items-center justify-center text-xs font-black flex-shrink-0" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                                                {u.email?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm truncate max-w-[220px]" style={{ color: 'var(--text-primary)' }}>{u.email}</p>
                                                {u.user_metadata?.is_admin && (
                                                    <span className="text-[9px] font-black uppercase text-[#ff5252] tracking-widest">Admin</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{notesCountByUser[u.id] || 0}</span>
                                    </td>
                                    <td className="p-4 text-zinc-500 text-xs font-bold">
                                        {new Date(u.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="p-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 border border-zinc-700 px-2 py-1">
                                            {u.app_metadata?.provider || 'email'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 border ${u.banned_until ? 'text-[#ff5252] border-[#ff5252] bg-[#ff5252]/10' : 'text-[#69f0ae] border-[#69f0ae]/50 bg-[#69f0ae]/5'}`}>
                                            {u.banned_until ? 'Suspended' : 'Active'}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-zinc-600 font-black uppercase tracking-widest text-xs">
                                        {serviceRoleKey
                                            ? 'No users found'
                                            : 'Add SUPABASE_SERVICE_ROLE_KEY to .env.local to see user accounts here'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
