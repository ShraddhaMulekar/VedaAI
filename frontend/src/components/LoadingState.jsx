import { Sparkles } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 flex-1 flex flex-col items-center justify-center min-h-[70vh]">
      <Sparkles className="h-14 w-14 text-brand-500 animate-pulse" strokeWidth={1.5} />
      <p className="mt-6 text-xl font-bold text-slate-900">Extracting...</p>
      <p className="mt-1 text-sm text-slate-500">This may take a while</p>
    </div>
  );
}
