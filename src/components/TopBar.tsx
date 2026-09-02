import { Search, Bell, Cpu, ChevronDown, Shield } from 'lucide-react';

export function TopBar({ onSearch }: { onSearch: () => void }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      {/* Hospital selector */}
      <div className="flex items-center gap-3">
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center">
            <Shield size={16} className="text-brand-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-900 leading-tight">Demo General Hospital</p>
            <p className="text-[10px] text-slate-500 leading-tight">Main Campus</p>
          </div>
          <ChevronDown size={16} className="text-slate-400" />
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Search button with shortcut */}
        <button
          onClick={onSearch}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-sm text-slate-500"
        >
          <Search size={16} />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-slate-100 text-[10px] font-mono font-semibold text-slate-500">
            ⌘ K
          </kbd>
        </button>

        {/* System health */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-success-50 border border-success-200">
          <Cpu size={16} className="text-success-600" />
          <span className="text-xs font-semibold text-success-700">System Healthy</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl hover:bg-slate-100 transition-colors">
          <Bell size={18} className="text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-critical-500 ring-2 ring-white" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
            SA
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-slate-900 leading-tight">Security Admin</p>
            <p className="text-[10px] text-slate-500 leading-tight">admin@demohospital.org</p>
          </div>
        </div>
      </div>
    </header>
  );
}
