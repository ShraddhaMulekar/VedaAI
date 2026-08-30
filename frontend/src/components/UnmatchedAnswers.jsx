export default function UnmatchedAnswers({ answers, selectedId, onSelect }) {
  return (
    <div className="mt-6">
      <h2 className="font-bold text-slate-900">
        Unmatched handwriting <span className="font-normal text-sm text-slate-400">not linked to any question</span>
      </h2>
      <div className="mt-3 space-y-3">
        {answers.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => onSelect(a.id)}
            className={`w-full text-left rounded-2xl border p-4 text-sm text-slate-600 transition ${
              selectedId === a.id ? "border-brand-500 ring-1 ring-brand-500" : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            {a.text}
          </button>
        ))}
      </div>
    </div>
  );
}
