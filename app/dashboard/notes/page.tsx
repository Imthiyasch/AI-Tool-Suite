import { createClient } from '../../../utils/supabase/server'
import { deleteNote } from './actions'
import { Trash2, Mic, ImageIcon, BookOpen } from 'lucide-react'
import { NotesForm } from './NotesForm'
import { NoteList } from './NoteList'
import { DailyBrief } from './DailyBrief'

export default async function NotesPage() {
    const supabase = await createClient()

    const { data: notes, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20 font-sans">
            <div className="space-y-4">
                <div className="inline-block bg-[#ffeb3b] text-black px-4 py-1 border-2 border-black font-black uppercase text-[10px] tracking-widest shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                    Neural Engine / Knowledge Base
                </div>
                <h2 className="text-5xl font-black uppercase italic tracking-tighter">Smart Notes</h2>
                <p className="text-zinc-500 text-xl font-medium max-w-2xl">
                    Take text notes, snap photos, or record voice memos. All secured with Supabase RLS.
                </p>
            </div>

            <DailyBrief />

            <NotesForm />

            <NoteList notes={notes || []} onDelete={deleteNote} />
        </div>
    )
}
