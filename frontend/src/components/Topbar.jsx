import { ArrowLeft, ClipboardList, HelpCircle, Bell, Sparkles, ChevronDown, Menu, UserRound } from "lucide-react";

export default function Topbar({ onBack, showBack }) {
  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between shrink-0">
      {/* Desktop: breadcrumb style */}
      <div className="hidden lg:flex items-center gap-3">
        {showBack && (
          <button type="button" onClick={onBack} className="text-slate-500 hover:text-slate-800" aria-label="Back">
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
          <ClipboardList className="h-[18px] w-[18px]" />
          <span>Exams</span>
        </div>
      </div>

      {/* Mobile: logo style */}
      <div className="flex lg:hidden items-center gap-2">
        {showBack && (
          <button type="button" onClick={onBack} className="text-slate-500 hover:text-slate-800 mr-1" aria-label="Back">
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <div className="h-7 w-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
          V
        </div>
        <span className="font-bold text-slate-900">VedaAI</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button type="button" className="hidden lg:flex text-slate-400 hover:text-slate-600" aria-label="Help">
          <HelpCircle className="h-5 w-5" />
        </button>
        <button type="button" className="relative text-slate-400 hover:text-slate-600" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-brand-500" />
        </button>
        <button type="button" className="hidden lg:flex text-slate-400 hover:text-slate-600" aria-label="AI toolkit">
          <Sparkles className="h-5 w-5" />
        </button>
        <button type="button" className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
            <UserRound className="h-4 w-4" />
          </span>
          <span className="hidden lg:inline text-sm font-semibold text-slate-800">Madhur Rastogi</span>
          <ChevronDown className="hidden lg:inline h-4 w-4 text-slate-400" />
        </button>
        <button type="button" className="lg:hidden text-slate-500" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
