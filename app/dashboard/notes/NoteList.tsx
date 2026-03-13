'use client'

import React from 'react'
import { Trash2, Mic, BookOpen } from 'lucide-react'
import { TiltCard } from '@/components/ui/TiltCard'

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
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
      {notes?.map((note, index) => (
        <TiltCard 
          key={note.id}
          className="group relative"
        >
          <div className="relative overflow-hidden border-4 border-black p-6 flex flex-col justify-between min-h-[250px] shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.2)] transition-all bg-zinc-950">
            
            {/* Decorative background plus signs */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-10 pointer-events-none">
                <span>+</span><span>+</span>
            </div>

            <div className="flex-1">
                {/* Image attachment */}
                {note.image_url && (
                    <div className="mb-6 -mx-6 -mt-6 relative overflow-hidden h-48 border-b-4 border-black">
                        <img
                            src={note.image_url}
                            alt="Note image"
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                        />
                    </div>
                )}

                {/* Text content */}
                {note.content && (
                    <p className="text-white text-lg font-bold whitespace-pre-wrap leading-relaxed mb-6 italic">
                      &quot;{note.content}&quot;
                    </p>
                )}

                {/* Audio attachment */}
                {note.audio_url && (
                    <div className="mb-6 flex items-center gap-4 bg-black p-4 border-2 border-white/5 shadow-[4px_4px_0px_0px_rgba(105,240,174,0.1)]">
                        <Mic className="w-5 h-5 text-[#69f0ae] flex-shrink-0" />
                        <audio
                            src={note.audio_url}
                            controls
                            className="flex-1 h-10 min-w-0 invert grayscale"
                        />
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between mt-4 border-t-2 border-white/5 pt-6">
                <div className="flex items-center gap-3">
                    <time className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        {new Date(note.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </time>
                    <div className="flex gap-1">
                      {note.image_url && <div className="w-2 h-2 rounded-full bg-[#448aff] animate-pulse" />}
                      {note.audio_url && <div className="w-2 h-2 rounded-full bg-[#69f0ae] animate-pulse" />}
                      {note.content && <div className="w-2 h-2 rounded-full bg-[#ffeb3b] animate-pulse" />}
                    </div>
                </div>
                
                <button 
                  onClick={() => onDelete(note.id)}
                  className="p-3 bg-black border-2 border-white/5 text-zinc-600 hover:text-[#ff5252] hover:border-[#ff5252] hover:bg-[#ff5252]/10 transition-all rounded-none shadow-[2px_2px_0px_0px_rgba(255,255,255,0.05)] active:translate-x-1 active:translate-y-1 active:shadow-none" 
                  title="Delete note"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
          </div>
        </TiltCard>
      ))}

      {(!notes || notes.length === 0) && (
          <div className="col-span-full py-24 text-center border-4 border-dashed border-zinc-800 flex flex-col items-center gap-4 bg-zinc-950/50">
              <div className="w-16 h-16 bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center rotate-45 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)]">
                  <BookOpen className="w-8 h-8 text-zinc-700 -rotate-45" />
              </div>
              <div>
                  <p className="font-black uppercase tracking-widest text-zinc-500">No data found in vault</p>
                  <p className="text-zinc-600 text-sm mt-2 font-medium">Create your first neural sync above.</p>
              </div>
          </div>
      )}
    </div>
  )
}
