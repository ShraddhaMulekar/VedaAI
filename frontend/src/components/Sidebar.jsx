import {
  LayoutGrid,
  MonitorPlay,
  FileText,
  ClipboardList,
  PieChart,
  Settings,
  Sparkles,
  PanelLeft,
  ChevronsRight,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutGrid, label: "Home" },
  { icon: MonitorPlay, label: "My Classroom" },
  { icon: FileText, label: "Assignments" },
  { icon: ClipboardList, label: "Exams", active: true },
  { icon: PieChart, label: "My Library" },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={`hidden lg:flex flex-col shrink-0 bg-white border-r border-slate-200 transition-all duration-200 ${
        collapsed ? "w-20 items-center py-6" : "w-64 p-5"
      }`}
    >
      <div className={`flex items-center ${collapsed ? "flex-col gap-4" : "justify-between"}`}>
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shrink-0">
            V
          </div>
          {!collapsed && <span className="font-bold text-lg text-slate-900">VedaAI</span>}
        </div>
        {!collapsed && (
          <button
            type="button"
            onClick={onToggle}
            className="text-slate-400 hover:text-slate-600 shrink-0"
            aria-label="Collapse sidebar"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
        )}
      </div>

      <button
        type="button"
        className={`mt-6 flex items-center gap-2 rounded-full bg-slate-900 text-white text-sm font-medium ring-2 ring-brand-500/70 ${
          collapsed ? "h-11 w-11 justify-center" : "px-4 py-2.5"
        }`}
      >
        <Sparkles className="h-4 w-4 text-brand-500 shrink-0" />
        {!collapsed && <span>AI Teacher's Toolkit</span>}
      </button>

      <nav className={`mt-6 flex flex-col gap-1 ${collapsed ? "items-center" : ""}`}>
        {NAV_ITEMS.map(({ icon: Icon, label, active }) => (
          <div
            key={label}
            title={collapsed ? label : undefined}
            className={`flex items-center gap-3 rounded-lg text-sm transition ${
              collapsed ? "h-10 w-10 justify-center" : "px-3 py-2.5"
            } ${
              active
                ? "bg-slate-100 text-slate-900 font-semibold"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            <Icon className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span>{label}</span>}
          </div>
        ))}
      </nav>

      <div className="flex-1" />

      {!collapsed && (
        <div
          title="Settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-700"
        >
          <Settings className="h-[18px] w-[18px] shrink-0" />
          <span>Settings</span>
        </div>
      )}

      {!collapsed ? (
        <div className="mt-2 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <SchoolCrest className="h-9 w-9 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">Delhi Public School</p>
            <p className="text-xs text-slate-500 truncate">Bokaro Steel City</p>
          </div>
        </div>
      ) : (
        <SchoolCrest className="h-9 w-9" title="Delhi Public School" />
      )}

      {collapsed && (
        <button
          type="button"
          onClick={onToggle}
          className="mt-4 text-slate-400 hover:text-slate-600"
          aria-label="Expand sidebar"
        >
          <ChevronsRight className="h-5 w-5" />
        </button>
      )}
    </aside>
  );
}

function SchoolCrest({ className, title }) {
  return (
    <div
      title={title}
      className={`rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2 4 5v6c0 5 3.4 8.6 8 9 4.6-.4 8-4 8-9V5l-8-3Z" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
