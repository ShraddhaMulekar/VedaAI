export default function ScoreSummary({ summary }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex flex-wrap items-center gap-8">
        <div>
          <p className="text-2xl font-semibold text-slate-800">
            {summary.correct}/{summary.answered}
          </p>
          <p className="text-xs text-slate-500">Correct of answered</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-slate-800">
            {summary.answered}/{summary.totalQuestions}
          </p>
          <p className="text-xs text-slate-500">Questions answered</p>
        </div>
        {summary.overallFeedback && (
          <p className="flex-1 text-sm text-slate-600 min-w-[240px]">{summary.overallFeedback}</p>
        )}
      </div>
    </div>
  );
}
