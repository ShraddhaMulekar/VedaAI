export default function UnmatchedAnswers({ answers, selectedId, onSelect }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
      <div className="px-4 py-3 font-semibold text-slate-800 text-sm">
        Unmatched handwriting
        <span className="ml-2 text-xs font-normal text-slate-400">not linked to any question</span>
      </div>
      {answers.map((a) => (
        <button
          key={a.id}
          type="button"
          onClick={() => onSelect(a.id)}
          className={`w-full text-left px-4 py-3 transition ${
            selectedId === a.id ? "bg-indigo-50" : "hover:bg-slate-50"
          }`}
        >
          <p className="text-sm text-slate-600 line-clamp-2">{a.text}</p>
        </button>
      ))}
    </div>
  );
}
