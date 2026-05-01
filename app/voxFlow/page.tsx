'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Mic, Volume2, Languages, LogIn, Zap } from 'lucide-react'

import AuthModal from '@/components/voxFlow/AuthModal'
import TranscribeTab from '@/components/voxFlow/TranscribeTab'
import TTSTab from '@/components/voxFlow/TTSTab'
import TranslateTab from '@/components/voxFlow/TranslateTab'

export default function VoxFlowPage() {
  const { toast } = useToast()

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const matchAuth = document.cookie.match(/(^| )access_token=([^;]+)/);
      if (matchAuth) {
        setIsAuthenticated(true);
      }
    }
  }, [])

  const handleLogout = () => {
    document.cookie = `access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    setIsAuthenticated(false)
    toast({ title: "Logged out", variant: "default" })
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Navigation */}
      <nav className="shrink-0 border-b border-slate-200 bg-white/80 backdrop-blur-md z-60">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <a
              href="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-600">
                Rumsan Automations
              </span>
            </a>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-4 bg-green-50 px-4 py-1.5 rounded-full border border-green-100">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm text-green-700 font-medium">Session Active</span>
                  </div>
                  <div className="w-px h-4 bg-green-200"></div>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 hover:text-red-600 hover:bg-red-50 h-7 text-xs px-2">
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-linear-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg shadow-blue-500/20 transition-all gap-2 h-10 px-5 rounded-xl font-bold active:scale-[0.98]"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isLoginModalOpen={isLoginModalOpen}
        setIsLoginModalOpen={setIsLoginModalOpen}
        setIsAuthenticated={setIsAuthenticated}
      />

      <main className="flex-1 container mx-auto px-4 py-4 max-w-5xl flex flex-col justify-center min-h-0">
        <div className="shrink-0 mb-3 ml-1">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">VoxFlow API</h1>
          <p className="text-slate-500 text-xs">Audio transcription, TTS, and translation engine</p>
        </div>


        <Tabs defaultValue="transcribe" className="w-full max-h-[calc(100vh-160px)] flex flex-col shadow-xl bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-200/60 relative group">
          {/* Decorative Top Accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 z-10" />

          <TabsList className="shrink-0 grid w-full grid-cols-3 bg-slate-50/50 p-1 border-b border-slate-100 rounded-none h-12">
            <TabsTrigger
              value="transcribe"
              className="text-xs flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all rounded-lg text-slate-600 font-bold"
            >
              <Mic className="h-3.5 w-3.5" />
              Transcribe
            </TabsTrigger>
            <TabsTrigger
              value="tts"
              className="text-xs flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all rounded-lg text-slate-600 font-bold"
            >
              <Volume2 className="h-3.5 w-3.5" />
              TTS
            </TabsTrigger>
            <TabsTrigger
              value="translate"
              className="text-xs flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm transition-all rounded-lg text-slate-600 font-bold"
            >
              <Languages className="h-3.5 w-3.5" />
              Translate
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto p-6 bg-linear-to-b from-white to-slate-50/20">
            <TabsContent value="transcribe" className="m-0 space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <TranscribeTab />
            </TabsContent>

            <TabsContent value="tts" className="m-0 space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <TTSTab />
            </TabsContent>

            <TabsContent value="translate" className="m-0 space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <TranslateTab />
            </TabsContent>

          </div>
        </Tabs>
      </main>
    </div>
  )
}
