import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ClipboardList, HelpCircle, Bell, Sparkles, ChevronDown, Menu, UserRound, Mail, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Topbar({ onBack, showBack }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

        {user && (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2"
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              <span className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                <UserRound className="h-4 w-4" />
              </span>
              <span className="hidden lg:inline text-sm font-semibold text-slate-800">{user.name}</span>
              <ChevronDown
                className={`hidden lg:inline h-4 w-4 text-slate-400 transition-transform ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-slate-200 bg-white shadow-lg py-2 z-20">
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                      <UserRound className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 text-sm truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                        <Mail className="h-3 w-3 shrink-0" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            )}
          </div>
        )}

        <button type="button" className="lg:hidden text-slate-500" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
