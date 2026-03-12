'use server'

import { createClient } from '../../../utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveSummaryAsNote(content: string) {
    const supabase = await createClient()

    if (!content) return { error: 'Content is required' }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const truncateTitle = content.split('\n')[0].substring(0, 50) + '...';
    const noteContent = `**YouTube Summary**\n\n${content}`;

    const { error } = await supabase.from('notes').insert({
        user_id: user.id,
        content: noteContent
    })

    if (error) {
        console.error('Error creating note from summary:', error.message)
        return { error: error.message }
    }

    revalidatePath('/dashboard/notes')
    revalidatePath('/dashboard/summarizer')
    return { success: true }
}
