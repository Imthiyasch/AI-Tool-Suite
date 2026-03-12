'use server'

import { createClient } from '../../../utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createNote(formData: FormData) {
    const supabase = await createClient()
    const content = formData.get('content') as string

    if (!content) return { error: 'Content is required' }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase.from('notes').insert({
        user_id: user.id,
        content
    })

    if (error) {
        console.error('Error creating note:', error.message)
        return { error: error.message }
    }

    revalidatePath('/dashboard/notes')
    return { success: true }
}

export async function createNoteWithMedia(
    content: string,
    imageFile?: File | null,
    audioBlob?: Blob | null
) {
    const supabase = await createClient()

    if (!content && !imageFile && !audioBlob) {
        return { error: 'Please provide some content, an image, or a voice note' }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    let image_url: string | null = null
    let audio_url: string | null = null

    // Upload image if provided
    if (imageFile) {
        const ext = imageFile.name.split('.').pop() || 'jpg'
        const fileName = `${user.id}/${Date.now()}.${ext}`
        const { data: imgData, error: imgError } = await supabase.storage
            .from('notes-media')
            .upload(fileName, imageFile, { contentType: imageFile.type, upsert: false })

        if (imgError) {
            console.error('Image upload error:', imgError.message)
            return { error: 'Failed to upload image: ' + imgError.message }
        }

        const { data: urlData } = supabase.storage
            .from('notes-media')
            .getPublicUrl(imgData.path)
        image_url = urlData.publicUrl
    }

    // Upload audio if provided
    if (audioBlob) {
        const fileName = `${user.id}/${Date.now()}.webm`
        const { data: audioData, error: audioError } = await supabase.storage
            .from('notes-media')
            .upload(fileName, audioBlob, { contentType: 'audio/webm', upsert: false })

        if (audioError) {
            console.error('Audio upload error:', audioError.message)
            return { error: 'Failed to upload audio: ' + audioError.message }
        }

        const { data: urlData } = supabase.storage
            .from('notes-media')
            .getPublicUrl(audioData.path)
        audio_url = urlData.publicUrl
    }

    const { error } = await supabase.from('notes').insert({
        user_id: user.id,
        content: content || '',
        image_url,
        audio_url,
    })

    if (error) {
        console.error('Error creating note with media:', error.message)
        return { error: error.message }
    }

    revalidatePath('/dashboard/notes')
    return { success: true }
}

export async function deleteNote(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase.from('notes').delete().eq('id', id).eq('user_id', user.id)
    if (error) {
        console.error('Error deleting note:', error.message)
        return { error: error.message }
    }

    revalidatePath('/dashboard/notes')
    return { success: true }
}
