import { VoiceAgent } from "@/components/voice-agent";
import { Zap } from "lucide-react";

export default function VoiceAgentPage() {
  return (
    <div className="h-screen bg-white text-slate-900 font-sans overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-60 border-b border-slate-200 bg-white/80 backdrop-blur-md">
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
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-20 pb-6 h-full">
        <div className="max-w-4xl mx-auto h-full flex flex-col gap-6">
          <div className="text-center shrink-0">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Rumsan Voice Assistant
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Experience our AI-powered voice assistant. Start a conversation to get help or explore our services through natural voice interaction.
            </p>
          </div>

          <div className="flex-1 min-h-0 px-2">
            <VoiceAgent 
              title="Rumsan AI Voice Assistant"
              description="Click the button below to start talking with our intelligent voice agent"
            />
          </div>
        </div>
      </main>
    </div>
  );
}