export default function QuestionList({ questions, selectedId, onSelect }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
      <div className="px-4 py-3 font-semibold text-slate-800 text-sm">Questions</div>
      {questions.map((q) => (
        <button
          key={q.id}
          type="button"
          onClick={() => onSelect(q.id)}
          className={`w-full text-left px-4 py-3 transition ${
            selectedId === q.id ? "bg-indigo-50" : "hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-slate-800 text-sm">Q{q.number}</span>
            <div className="flex items-center gap-2 shrink-0">
              {q.grading && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    q.grading.isCorrect
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {q.grading.isCorrect ? "Correct" : "Incorrect"}
                </span>
              )}
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  q.status === "answered"
                    ? "bg-slate-100 text-slate-600"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {q.status === "answered" ? "Answered" : "Unanswered"}
              </span>
            </div>
          </div>
          <p className="mt-1 text-sm text-slate-600 line-clamp-2">{q.text}</p>
          {selectedId === q.id && q.answer && (
            <div className="mt-2 text-xs text-slate-500 bg-slate-50 rounded-md p-2">
              <span className="font-medium">Answer: </span>
              {q.answer.text}
            </div>
          )}
          {selectedId === q.id && q.grading?.feedback && (
            <p className="mt-1 text-xs text-indigo-700">{q.grading.feedback}</p>
          )}
        </button>
      ))}
    </div>
  );
}
