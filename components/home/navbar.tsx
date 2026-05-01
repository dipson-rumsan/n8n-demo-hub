import { Zap } from "lucide-react";

export const Navbar = () => (
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
          <span className="text-lg sm:text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-600 truncate">
            Rumsan Automations
          </span>
        </a>
      </div>
    </div>
  </nav>
);
