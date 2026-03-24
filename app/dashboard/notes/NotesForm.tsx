'use client'

import { useRef, useTransition, useState, useCallback } from 'react'
import { createNoteWithMedia } from './actions'
import { Loader2, ImageIcon, Mic, MicOff, X, Play, Square } from 'lucide-react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

export function NotesForm() {
    const formRef = useRef<HTMLFormElement>(null)
    const [isPending, startTransition] = useTransition()
    const [content, setContent] = useState('')

    // Image state
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Audio state
    const [isRecording, setIsRecording] = useState(false)
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])

    // Handle image selection
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setImageFile(file)
        const reader = new FileReader()
        reader.onload = (ev) => setImagePreview(ev.target?.result as string)
        reader.readAsDataURL(file)
    }

    const clearImage = () => {
        setImageFile(null)
        setImagePreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    // Handle audio recording
    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const recorder = new MediaRecorder(stream)
            mediaRecorderRef.current = recorder
            audioChunksRef.current = []

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data)
            }

            recorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
                setAudioBlob(blob)
                setAudioUrl(URL.createObjectURL(blob))
                stream.getTracks().forEach(t => t.stop())
            }

            recorder.start()
            setIsRecording(true)
        } catch (err) {
            alert('Microphone access denied. Please allow microphone access in your browser.')
        }
    }, [])

    const stopRecording = useCallback(() => {
        mediaRecorderRef.current?.stop()
        setIsRecording(false)
    }, [])

    const clearAudio = () => {
        setAudioBlob(null)
        setAudioUrl(null)
        audioChunksRef.current = []
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!content && !imageFile && !audioBlob) {
            alert('Please add some text, an image, or record a voice note.')
            return
        }

        startTransition(async () => {
            const formData = new FormData()
            formData.append('content', content || '')
            if (imageFile) formData.append('image', imageFile)
            if (audioBlob) formData.append('audio', audioBlob)
            
            const result = await createNoteWithMedia(formData)
            if (result.success) {
                setContent('')
                clearImage()
                clearAudio()
            } else {
                alert(result.error || 'Failed to create note')
            }
        })
    }

    return (
        <div className="p-8 shadow-sm mb-12 glass-panel" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* Text input row */}
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 relative">
                        <ReactQuill 
                            theme="snow" 
                            value={content} 
                            onChange={setContent} 
                            placeholder="Draft a new neural sync..."
                            readOnly={isPending}
                        />
                    </div>
                    {/* Media action buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-start items-start">
                        <div className="flex gap-2">
                            {/* Image picker */}
                            <button
                                type="button"
                                title="Attach image"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isPending}
                                className={`p-4 rounded-xl transition-all ${imageFile ? 'shadow-md opacity-100' : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'}`}
                                style={imageFile ? { backgroundColor: 'var(--accent-blue)', color: '#fff' } : { border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                            >
                                <ImageIcon className="w-5 h-5" />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageSelect}
                            />

                            {/* Microphone button */}
                            <button
                                type="button"
                                title={isRecording ? 'Stop recording' : 'Record voice note'}
                                onClick={isRecording ? stopRecording : startRecording}
                                disabled={isPending}
                                className={`p-4 rounded-xl transition-all ${isRecording ? 'animate-pulse' : audioBlob ? 'shadow-md' : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'}`}
                                style={isRecording ? { backgroundColor: 'var(--accent-red)', color: '#fff' } : audioBlob ? { backgroundColor: 'var(--accent-green)', color: '#fff' } : { border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                            >
                                {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Save button */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-10 py-4 font-bold uppercase text-sm tracking-[0.15em] rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-md hover:shadow-lg w-full sm:w-auto"
                            style={{ backgroundColor: 'var(--accent-yellow)', color: '#111827', border: '1px solid rgba(0,0,0,0.1)' }}
                        >
                            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Note'}
                        </button>
                    </div>
                </div>

                {/* Recording indicator */}
                {isRecording && (
                    <div className="flex items-center gap-3 text-[#ff5252] font-black uppercase text-[10px] tracking-widest px-1">
                        <div className="w-2 h-2 rounded-full bg-[#ff5252] animate-pulse" />
                        Recording Stream / Active
                    </div>
                )}

                {/* Previews row */}
                <div className="flex flex-wrap gap-6">
                    {/* Image preview */}
                    {imagePreview && (
                        <div className="relative group p-1 rounded-xl glass-panel shadow-sm">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="h-24 w-24 object-cover rounded-lg"
                                style={{ border: '1px solid var(--border-color)' }}
                            />
                            <button
                                type="button"
                                onClick={clearImage}
                                className="absolute -top-3 -right-3 p-1 rounded-full hover:bg-red-500/10 transition-all shadow-md z-10"
                                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--accent-red)' }}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Audio preview */}
                    {audioUrl && (
                        <div className="flex items-center gap-4 px-6 py-4 glass-panel rounded-xl shadow-sm">
                            <Mic className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--accent-green)' }} />
                            <audio src={audioUrl} controls className="h-10 max-w-[250px]" style={{ filter: 'grayscale(1) invert(0.8)' }} />
                            <button
                                type="button"
                                onClick={clearAudio}
                                className="p-2 rounded-full hover:bg-red-500/10 transition-all shadow-md"
                                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--accent-red)' }}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    )
}
