import CVUploader from "@/components/cv-uploader"
import { Zap } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="h-screen bg-white text-slate-900 overflow-hidden">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex h-8 items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-600">
                Rumsan Automations
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <CVUploader />
      </div>
    </main>
  )
}
