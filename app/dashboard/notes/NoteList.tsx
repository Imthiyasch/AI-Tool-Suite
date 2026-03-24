'use client'

import React, { useState } from 'react'
import { Trash2, Mic, BookOpen, Pencil, Check, X } from 'lucide-react'
import { TiltCard } from '@/components/ui/TiltCard'
import { updateNote } from './actions'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

interface Note {
  id: string
  content?: string
  image_url?: string
  audio_url?: string
  created_at: string
}

interface NoteListProps {
  notes: Note[]
  onDelete: (id: string) => Promise<{ error: string } | { success: boolean }>
}

export const NoteList: React.FC<NoteListProps> = ({ notes, onDelete }) => {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [saving, setSaving] = useState(false)

  const startEdit = (note: Note) => {
    setEditingId(note.id)
    setEditContent(note.content || '')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditContent('')
  }

  const saveEdit = async (id: string) => {
    setSaving(true)
    const res = await updateNote(id, editContent)
    setSaving(false)
    if ('error' in res) {
      alert('Error: ' + res.error)
    } else {
      setEditingId(null)
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
      {notes?.map((note) => (
        <TiltCard key={note.id} className="group relative">
          <div className="relative overflow-hidden p-6 flex flex-col justify-between min-h-[250px] glass-panel w-full">
            <div className="flex-1">
              {/* Image attachment */}
              {note.image_url && (
                <div className="mb-6 -mx-6 -mt-6 relative overflow-hidden h-48" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <img
                    src={note.image_url}
                    alt="Note image"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-duration-500 scale-105 group-hover:scale-100"
                  />
                </div>
              )}

              {/* Text content — inline edit mode */}
              {editingId === note.id ? (
                <div className="flex flex-col gap-3 mb-4">
                  <ReactQuill 
                    theme="snow" 
                    value={editContent} 
                    onChange={setEditContent} 
                    className="w-full"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(note.id)}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 font-bold uppercase text-xs tracking-widest rounded-lg transition-all disabled:opacity-50 shadow-sm"
                      style={{ backgroundColor: 'var(--accent-green)', color: '#111827' }}
                    >
                      <Check className="w-3 h-3" />
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-2 px-4 py-2 font-bold uppercase text-xs tracking-widest rounded-lg transition-all hover:bg-black/5 dark:hover:bg-white/5"
                      style={{ border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                    >
                      <X className="w-3 h-3" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                note.content && (
                  <div 
                    className="prose-custom mb-6 w-full"
                    dangerouslySetInnerHTML={{ __html: note.content }}
                  />
                )
              )}

              {/* Audio attachment */}
              {note.audio_url && (
                <div className="mb-6 flex items-center gap-4 p-4 rounded-xl" style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
                  <Mic className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--accent-green)' }} />
                  <audio src={note.audio_url} controls className="flex-1 h-10 min-w-0" style={{ filter: 'grayscale(1) invert(0.8)' }} />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4 pt-6" style={{ borderTop: '1px solid var(--border-color)' }}>
              <div className="flex items-center gap-3">
                <time className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                  {new Date(note.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </time>
                <div className="flex gap-1">
                  {note.image_url && <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent-blue)' }} />}
                  {note.audio_url && <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent-green)' }} />}
                  {note.content && <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent-yellow)' }} />}
                </div>
              </div>

              <div className="flex gap-2">
                {/* Edit button */}
                {editingId !== note.id && (
                  <button
                    onClick={() => startEdit(note)}
                    className="p-3 rounded-lg transition-all hover:bg-black/5 dark:hover:bg-white/5"
                    style={{ border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
                    title="Edit note"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
                {/* Delete button */}
                <button
                  onClick={() => onDelete(note.id)}
                  className="p-3 rounded-lg transition-all hover:bg-red-500/10"
                  style={{ border: '1px solid var(--border-color)', color: 'var(--accent-red)' }}
                  title="Delete note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </TiltCard>
      ))}

      {(!notes || notes.length === 0) && (
        <div className="col-span-full py-24 text-center flex flex-col items-center gap-4 rounded-3xl" style={{ border: '2px dashed var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center rotate-12 shadow-sm" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <BookOpen className="w-8 h-8 -rotate-12" style={{ color: 'var(--text-secondary)' }} />
          </div>
          <div>
            <p className="font-bold uppercase tracking-widest text-sm" style={{ color: 'var(--text-secondary)' }}>No data found in vault</p>
            <p className="text-sm mt-2 font-medium" style={{ color: 'var(--text-primary)', opacity: 0.7 }}>Create your first neural sync above.</p>
          </div>
        </div>
      )}
    </div>
  )
}
