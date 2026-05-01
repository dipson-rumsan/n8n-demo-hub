'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useVoxTranslate } from '@/hooks/use-vox-flow'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Languages } from 'lucide-react'

export default function TranslateTab() {
  const { toast } = useToast()

  const [translateText, setTranslateText] = useState('')
  const [translateSource, setTranslateSource] = useState('auto')
  const [translateTarget, setTranslateTarget] = useState('eng_Latn')
  const [translationResult, setTranslationResult] = useState<any>(null)

  const translateMut = useVoxTranslate()

  const handleTranslate = () => {
    if (!translateText) return toast({ title: "Please enter text", variant: "destructive" })
    translateMut.mutate({ text: translateText, currentLang: translateSource, targetLang: translateTarget }, {
      onSuccess: (data: any) => {
        setTranslationResult(data)
        toast({ title: "Translation Complete" })
      },
      onError: (err: any) => toast({ title: "Translation Failed", description: err.message, variant: "destructive" })
    })
  }

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0 pb-1 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-1.5 text-sm text-gray-800 tracking-tight">
          <Languages className="h-3.5 w-3.5 text-teal-600" />
          Translation
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 space-y-2.5">
        <div className="space-y-1.5">
          <div className="border-2 border-dashed border-slate-100 rounded-2xl p-3 bg-teal-50/10">
            <Label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">Input Text</Label>
            <Textarea
              placeholder="Text to translate..."
              className="min-h-20 max-h-28 text-xs rounded-xl focus-visible:ring-teal-500 border-teal-100/30 p-3 bg-white shadow-xs leading-relaxed"
              value={translateText}
              onChange={(e) => setTranslateText(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 p-2 bg-teal-50/20 rounded-xl border border-teal-100/30">
          <div className="space-y-0.5">
            <Label className="text-[8px] font-bold text-teal-600 uppercase tracking-widest px-1">From</Label>
            <Select value={translateSource} onValueChange={setTranslateSource}>
              <SelectTrigger className="bg-white h-7 text-[10px] border-teal-100/50">
                <SelectValue placeholder="Auto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Automatic</SelectItem>
                <SelectItem value="eng_Latn">English</SelectItem>
                <SelectItem value="nep_Deva">Nepali</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-0.5">
            <Label className="text-[8px] font-bold text-teal-600 uppercase tracking-widest px-1">To</Label>
            <Select value={translateTarget} onValueChange={setTranslateTarget}>
              <SelectTrigger className="bg-white h-7 text-[10px] border-teal-100/50">
                <SelectValue placeholder="Target" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eng_Latn">English</SelectItem>
                <SelectItem value="nep_Deva">Nepali</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button className="w-full h-8 text-[10px] font-bold bg-teal-600 hover:bg-teal-700 shadow-sm" onClick={handleTranslate} disabled={translateMut.isPending}>
          <Languages className="h-3 w-3 mr-2" />
          {translateMut.isPending ? 'Translating...' : 'Convert Language'}
        </Button>

        {translationResult && (
          <div className="pt-1.5 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-400">
            <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-sm">
               <div className="flex items-center justify-between mb-1.5">
                 <Label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest px-0.5">Translation Result</Label>
                 <Badge variant="outline" className="text-[7px] h-3.5 py-0 px-1 border-teal-200 bg-teal-50 text-teal-600">200 OK</Badge>
               </div>
               <div className="p-2.5 bg-teal-50/30 rounded-lg border border-teal-100/30 text-xs text-slate-800 leading-normal font-medium italic">
                  {translationResult.translation || translationResult.translated_text || JSON.stringify(translationResult)}
               </div>
            </div>

          </div>
        )}
      </CardContent>
    </Card>
  )
}
