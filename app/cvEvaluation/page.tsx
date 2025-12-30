import CVUploader from "@/components/cv-uploader"
import { Zap } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex h-8 items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
                Rumsan Automations
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 ">
        {/* <div className=""> */}
          {/* <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-balance">
              CV Uploader
            </h1>
            <p className="text-lg text-slate-400 text-pretty">
              Upload, validate, and preview your CV with our intelligent parsing system
            </p>
          </div> */}

          <CVUploader />
        {/* </div> */}
      </div>

      {/* Footer */}
      {/* <div className="border-t border-slate-800 mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-slate-500">
            Powered by n8n automation workflows and Google Sheets integration
          </p>
        </div>
      </div> */}
    </main>
  )
}
