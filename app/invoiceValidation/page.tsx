import { ClaimsPortal } from "@/components/claims-portal";
import { Zap } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="w-full px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex h-12 items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
                Rumsan Automations
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <section className="mx-auto max-w-480px-6 sm:px-6 lg:px-6">
        {/* Bigger Content Container */}
        <div className="w-full max-w-480px-6 rounded-2xl bg-slate-900/70 border border-slate-800 p-6 sm:p-8 lg:p-8 mx-auto my-6">
          <h4 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">
            Claims Portal
          </h4>
          <ClaimsPortal />
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="border-t border-slate-800">
        <div className="mx-auto max-w-480px-6 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Rumsan Automations
          </p>
          <p className="text-sm text-slate-500">
            Powered by automated workflows
          </p>
        </div>
      </footer> */}
    </main>
  );
}
