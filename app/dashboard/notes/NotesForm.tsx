'use client'

import { useRef, useTransition, useState, useCallback } from 'react'
import { createNoteWithMedia } from './actions'
import { Loader2, ImageIcon, Mic, MicOff, X, Play, Square } from 'lucide-react'
import Image from 'next/image'

export function NotesForm() {
    const formRef = useRef<HTMLFormElement>(null)
    const [isPending, startTransition] = useTransition()

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
        const formData = new FormData(e.currentTarget)
        const content = formData.get('content') as string

        if (!content && !imageFile && !audioBlob) {
            alert('Please add some text, an image, or record a voice note.')
            return
        }

        startTransition(async () => {
            const result = await createNoteWithMedia(content, imageFile, audioBlob)
            if (result.success) {
                formRef.current?.reset()
                clearImage()
                clearAudio()
            } else {
                alert(result.error || 'Failed to create note')
            }
        })
    }

    return (
        <div className="bg-zinc-950 p-8 border-4 border-black space-y-6 shadow-[8px_8px_0px_0px_rgba(255,235,59,0.1)]">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* Text input row */}
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            name="content"
                            placeholder="Type a neural sync note..."
                            disabled={isPending}
                            className="w-full bg-black border-4 border-black px-6 py-4 text-white font-bold text-lg focus:outline-none focus:bg-zinc-900 placeholder:text-zinc-700 transition-all disabled:opacity-50"
                        />
                    </div>
                    {/* Media action buttons */}
                    <div className="flex gap-4 items-center">
                        {/* Image picker */}
                        <button
                            type="button"
                            title="Attach image"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isPending}
                            className={`p-4 border-4 border-black transition-all ${imageFile ? 'bg-[#448aff] text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]' : 'bg-white text-black hover:bg-[#448aff] hover:text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]'}`}
                        >
                            <ImageIcon className="w-6 h-6" />
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
                            className={`p-4 border-4 border-black transition-all ${isRecording ? 'bg-[#ff5252] text-white animate-pulse' : audioBlob ? 'bg-[#69f0ae] text-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]' : 'bg-white text-black hover:bg-[#ff5252] hover:text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]'}`}
                        >
                            {isRecording ? <Square className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                        </button>

                        {/* Save button */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="bg-[#ffeb3b] text-black px-10 py-4 border-4 border-black font-black uppercase text-sm tracking-[0.2em] hover:bg-white transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
                        >
                            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sync Now'}
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
                        <div className="relative group p-1 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="h-24 w-24 object-cover border-2 border-black"
                            />
                            <button
                                type="button"
                                onClick={clearImage}
                                className="absolute -top-3 -right-3 bg-black text-white p-1 border-2 border-white hover:bg-[#ff5252] transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Audio preview */}
                    {audioUrl && (
                        <div className="flex items-center gap-4 bg-white border-4 border-black px-6 py-4 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
                            <Mic className="w-5 h-5 text-black flex-shrink-0" />
                            <audio src={audioUrl} controls className="h-10 max-w-[250px] invert" />
                            <button
                                type="button"
                                onClick={clearAudio}
                                className="bg-black text-white p-2 border-2 border-white hover:bg-[#ff5252] transition-all"
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
