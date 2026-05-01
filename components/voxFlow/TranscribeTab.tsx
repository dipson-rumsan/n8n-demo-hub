'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useVoxTranscribeShort, useVoxTranscribeLong, useVoxTranscribeOnly } from '@/hooks/use-vox-flow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Mic, FileAudio, Upload, Zap, X } from 'lucide-react'

export default function TranscribeTab() {
  const { toast } = useToast()

  const [fileSelection, setFileSelection] = useState<{ type: 'sample' | 'file'; name: string; file?: File } | null>({
    type: 'sample',
    name: 'sample_audio.wav'
  })
  const [transcribeType, setTranscribeType] = useState('short')
  const [transcribeLang, setTranscribeLang] = useState('auto')
  const [transcriptionResult, setTranscriptionResult] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  const transcribeShortMut = useVoxTranscribeShort()
  const transcribeLongMut = useVoxTranscribeLong()
  const transcribeOnlyMut = useVoxTranscribeOnly()

  const handleTranscribe = () => {

    if (!fileSelection) return toast({ title: "Please select an audio file or use sample audio", variant: "destructive" })

    const fd = new FormData()
    const useSample = fileSelection.type === 'sample'
    
    const appendAudioAndSubmit = (audioBlob: Blob | File, filename: string) => {
      const fileToUpload = audioBlob instanceof File ? audioBlob : new File([audioBlob], filename, { type: audioBlob.type || 'audio/wav' })
      fd.append('file', fileToUpload)

      const onSuccess = (data: any) => {
        setTranscriptionResult(data)
        toast({ title: "Transcription Complete" })
      }
      const onError = (err: any) => toast({ title: "Transcription Failed", description: err.message, variant: "destructive" })

      if (transcribeType === 'short') transcribeShortMut.mutate({ formData: fd, useSample, languages: transcribeLang }, { onSuccess, onError })
      else if (transcribeType === 'long') transcribeLongMut.mutate({ formData: fd, useSample, languages: transcribeLang }, { onSuccess, onError })
      else transcribeOnlyMut.mutate({ formData: fd, type: 'short', useSample }, { onSuccess, onError })
    }

    if (useSample) {
      fetch('/sample_audio.wav')
        .then(res => res.blob())
        .then(blob => appendAudioAndSubmit(blob, 'sample_audio.wav'))
        .catch(() => toast({ title: "Failed to load sample audio", variant: "destructive" }))
    } else {
      appendAudioAndSubmit(fileSelection.file!, fileSelection.name)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({ title: "Copied to clipboard" })
  }

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0 pb-1 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-1.5 text-sm text-gray-800 tracking-tight">
          <Mic className="h-3.5 w-3.5 text-blue-600" />
          Audio Transcription
        </CardTitle>
      </CardHeader>

      <CardContent className="px-0">
        <div className={`transition-all duration-500 ${transcriptionResult ? 'grid md:grid-cols-2 gap-6 items-start' : 'max-w-md mx-auto py-4'}`}>
          {/* Left Column: Controls */}
          <div className="space-y-4">
            {fileSelection?.type === 'sample' && (
              <div className="p-2 bg-linear-to-r from-indigo-50/50 to-blue-50/50 rounded-xl border border-indigo-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="h-4 w-4 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
                  <Zap className="h-2.5 w-2.5 text-white" />
                </div>
                <p className="text-[10px] text-indigo-900 leading-tight font-medium">
                  Using <span className="font-bold underline decoration-indigo-200 underline-offset-1">sample audio</span>. Remove for custom upload.
                </p>
              </div>
            )}

            <div className={`group relative border-2 border-dashed transition-all duration-300 rounded-xl p-3 text-center overflow-hidden ${fileSelection ? 'bg-indigo-50/10 border-indigo-400/20' : 'border-slate-200 hover:border-blue-400 bg-slate-50/50'}`}>
              {fileSelection ? (
                <div className="animate-in fade-in zoom-in-95 duration-300 flex flex-col items-center">
                  <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center mb-1.5 border border-indigo-100 shadow-sm">
                    <FileAudio className={`h-4 w-4 ${fileSelection.type === 'sample' ? 'text-indigo-600' : 'text-blue-600'}`} />
                  </div>
                  <div className="flex flex-col items-center gap-0.5 mb-2">
                    <h4 className="text-[10px] font-bold text-slate-800 tracking-tight truncate max-w-40">{fileSelection.name}</h4>
                  </div>
                  <button onClick={() => setFileSelection(null)} className="text-[8px] font-bold text-slate-500 hover:text-red-500 transition-colors bg-white border border-slate-200 px-2 py-1 rounded-lg">
                    Change Audio
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center py-1">
                  <Upload className="h-4 w-4 text-slate-300 mb-1" />
                  <h4 className="text-[10px] font-bold text-slate-700 mb-2">Upload Audio</h4>
                  <label className="cursor-pointer inline-flex items-center justify-center rounded-lg text-[9px] font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 h-7 px-4 shadow-xs">
                    Browse Files
                    <input type="file" className="hidden" accept="audio/*" onChange={(e) => e.target.files?.[0] && setFileSelection({ type: 'file', name: e.target.files[0].name, file: e.target.files[0] })} />
                  </label>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest ml-1">Type</Label>
                <Select value={transcribeType} onValueChange={setTranscribeType}>
                  <SelectTrigger className="bg-white h-7 text-[10px] rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                    <SelectItem value="transcribe-only">Raw</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest ml-1">Language</Label>
                <Select value={transcribeLang} onValueChange={setTranscribeLang}>
                  <SelectTrigger className="bg-white h-7 text-[10px] rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="eng_Latn">English</SelectItem>
                    <SelectItem value="nep_Deva">Nepali</SelectItem>
                    <SelectItem value="hin_Deva">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              className="w-full h-9 text-[11px] font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 rounded-xl transition-all active:scale-[0.98]"
              onClick={handleTranscribe}
              disabled={transcribeShortMut.isPending || transcribeLongMut.isPending || transcribeOnlyMut.isPending}
            >
              {(transcribeShortMut.isPending || transcribeLongMut.isPending || transcribeOnlyMut.isPending) ? (
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  Processing...
                </span>
              ) : 'Run Transcription'}
            </Button>
          </div>

          {/* Right Column: Results */}
          {transcriptionResult && (
            <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm relative group/result overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-blue-50 text-blue-600 border-blue-100 text-[8px] font-bold px-1.5 py-0">
                    {transcriptionResult.model_used || 'STT'}
                  </Badge>
                  <Badge variant="outline" className="text-[7px] h-3.5 py-0 px-1 border-green-200 bg-green-50 text-green-600">200 OK</Badge>
                </div>

                <div className="space-y-3">
                  <div className="relative group/text">
                    <div className="p-2.5 bg-slate-50/50 rounded-lg border border-slate-100 text-[11px] text-slate-800 leading-relaxed font-medium pr-14 transition-all group-hover/text:border-blue-200 max-h-32 overflow-y-auto custom-scrollbar">
                      <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Transcription</div>
                      {transcriptionResult.transcription || 'No text found.'}
                    </div>
                    <Button 
                      className="absolute top-1 right-1 h-5 px-1.5 text-[8px] font-bold bg-white/80 backdrop-blur-xs border border-slate-200 text-slate-600 hover:bg-white hover:text-blue-600 shadow-xs transition-all opacity-0 group-hover/text:opacity-100"
                      onClick={() => copyToClipboard(transcriptionResult.transcription || '')}
                    >
                      <Zap className="h-2 w-2 mr-1 text-blue-500" />
                      Copy
                    </Button>
                  </div>

                  {transcriptionResult.translation && (
                    <div className="relative group/trans">
                      <div className="p-2.5 bg-indigo-50/30 rounded-lg border border-indigo-100/30 text-[11px] text-slate-800 leading-relaxed font-medium italic pr-14 transition-all group-hover/trans:border-indigo-300 max-h-32 overflow-y-auto custom-scrollbar">
                        <div className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest mb-1 not-italic">Translation</div>
                        {transcriptionResult.translation}
                      </div>
                      <Button 
                        className="absolute top-1 right-1 h-5 px-1.5 text-[8px] font-bold bg-white/80 backdrop-blur-xs border border-indigo-200 text-indigo-600 hover:bg-white hover:text-indigo-700 shadow-xs transition-all opacity-0 group-hover/trans:opacity-100"
                        onClick={() => copyToClipboard(transcriptionResult.translation || '')}
                      >
                        <Zap className="h-2 w-2 mr-1 text-indigo-500" />
                        Copy
                      </Button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
