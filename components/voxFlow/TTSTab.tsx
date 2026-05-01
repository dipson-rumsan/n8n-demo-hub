'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useVoxTTS } from '@/hooks/use-vox-flow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Volume2, Play, Download } from 'lucide-react'

export default function TTSTab() {
  const { toast } = useToast()

  const [ttsText, setTtsText] = useState('')
  const [ttsLang, setTtsLang] = useState('eng_Latn')
  const [ttsResult, setTtsResult] = useState<any>(null)

  const ttsMut = useVoxTTS()

  const handleTTS = () => {
    if (!ttsText) return toast({ title: "Please enter text", variant: "destructive" })
    ttsMut.mutate({ text: ttsText, language: ttsLang }, {
      onSuccess: (data) => {
        setTtsResult(data);
        toast({ title: "Audio Generated!" });
      },
      onError: (err: any) => toast({ title: "TTS Failed", description: err.message, variant: "destructive" })
    })
  }

  const audioUrl = ttsResult?.url || ttsResult?.audio_url || ttsResult?.file_url || ttsResult?.file;

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0 pb-1 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-1.5 text-sm text-gray-800 tracking-tight">
          <Volume2 className="h-3.5 w-3.5 text-indigo-600" />
          Text to Speech
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 space-y-2.5">
        <div className="space-y-1.5">
          <div className="border-2 border-dashed border-slate-100 rounded-2xl p-3 bg-indigo-50/10">
            <Label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">Text for Conversion</Label>
            <Textarea
              placeholder="What should I say?"
              className="min-h-20 max-h-28 text-xs border-gray-100 hover:border-indigo-400/30 transition-all focus-visible:ring-indigo-500 rounded-xl p-3 bg-white shadow-xs leading-relaxed"
              value={ttsText}
              onChange={(e) => setTtsText(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 p-2 bg-indigo-50/20 rounded-xl border border-indigo-100/30">
          <div className="space-y-0.5">
            <Label className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest px-1">Language</Label>
            <Select value={ttsLang} onValueChange={setTtsLang}>
              <SelectTrigger className="bg-white h-7 text-[10px] border-indigo-100/50">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="nepali">Nepali</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1 h-8 text-[10px] font-bold bg-indigo-600 hover:bg-indigo-700 shadow-sm" onClick={handleTTS} disabled={ttsMut.isPending}>
            <Play className="h-3 w-3 mr-2" />
            {ttsMut.isPending ? 'Generating...' : 'Convert to Audio'}
          </Button>
          <Button variant="outline" className="h-8 px-3 text-[10px] font-bold border-indigo-100" disabled={!audioUrl} asChild={!!audioUrl}>
            {audioUrl ? (
              <a href={audioUrl} download="output.wav">
                <Download className="h-3 w-3" />
              </a>
            ) : (
              <Download className="h-3 w-3" />
            )}
          </Button>
        </div>

        {audioUrl && (
          <div className="mt-2 p-3 bg-white rounded-xl border border-indigo-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-400">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                <Volume2 className="h-3 w-3" />
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-bold text-slate-800 uppercase tracking-tight">Audio Generated</p>
              </div>
            </div>

            {ttsResult?.text && (
              <div className="mb-2 px-2 py-1.5 bg-slate-50/50 rounded-lg border border-slate-100 italic text-slate-500 text-[10px] line-clamp-2">
                "{ttsResult.text}"
              </div>
            )}

            <audio key={audioUrl} controls className="w-full h-8 rounded-lg scale-95 origin-left">
              <source src={audioUrl} type="audio/wav" />
            </audio>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
