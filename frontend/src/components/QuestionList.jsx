import { ChevronDown, ChevronUp } from "lucide-react";

export default function QuestionList({ questions, selectedId, expandedIds, onSelect, onToggleExpand, allExpanded, onToggleAll }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="font-bold text-slate-900">Extracted Questions (from question paper)</h2>
        <button
          type="button"
          onClick={onToggleAll}
          className="shrink-0 text-sm font-medium bg-white border border-slate-200 rounded-full px-4 py-1.5 hover:bg-slate-50"
        >
          {allExpanded ? "Collapse All" : "Expand All"}
        </button>
      </div>

      <div className="space-y-3">
        {questions.map((q) => {
          const expanded = expandedIds.has(q.id);
          const graded = q.grading;
          const canExpand = q.status === "answered" && !!graded?.feedback;

          return (
            <div
              key={q.id}
              className={`bg-white rounded-2xl border p-4 transition ${
                expanded ? "border-brand-500 ring-1 ring-brand-500" : "border-slate-200"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelect(q.id)}
                className="w-full flex items-center gap-3 text-left"
              >
                <span className="h-7 w-7 rounded-full bg-slate-800 text-white text-xs font-semibold flex items-center justify-center shrink-0">
                  {q.number}
                </span>
                <span className="flex-1 min-w-0 text-sm text-slate-800">{q.text}</span>
                <ScorePill question={q} />
                {canExpand && (
                  <span
                    role="button"
                    tabIndex={-1}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleExpand(q.id);
                    }}
                    className="shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100"
                  >
                    {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                )}
              </button>

              {expanded && graded?.feedback && (
                <div className="mt-3 rounded-xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900 text-sm">AI Feedback</p>
                  <p className="mt-1.5 text-sm text-slate-600">{graded.feedback}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScorePill({ question }) {
  if (question.status !== "answered") {
    return (
      <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
        Unanswered
      </span>
    );
  }
  if (!question.grading) {
    return (
      <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
        Answered
      </span>
    );
  }
  const { marksAwarded, maxMarks } = question.grading;
  const positive = marksAwarded > 0;
  return (
    <span
      className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
        positive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-600"
      }`}
    >
      {marksAwarded} / {maxMarks}
    </span>
  );
}
