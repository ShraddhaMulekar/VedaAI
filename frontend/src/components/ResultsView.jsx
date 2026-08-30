import { useMemo, useState } from "react";
import QuestionList from "./QuestionList";
import UnmatchedAnswers from "./UnmatchedAnswers";
import AnswerViewer from "./AnswerViewer";

export default function ResultsView({ result, answerFiles }) {
  const [selectedId, setSelectedId] = useState(null);
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [mobileTab, setMobileTab] = useState("questions");

  const gradableIds = useMemo(
    () => result.questions.filter((q) => q.status === "answered" && q.grading?.feedback).map((q) => q.id),
    [result.questions]
  );
  const allExpanded = gradableIds.length > 0 && gradableIds.every((id) => expandedIds.has(id));

  function toggleExpand(id) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setExpandedIds(allExpanded ? new Set() : new Set(gradableIds));
  }

  function handleSelect(id) {
    setSelectedId(id);
    if (gradableIds.includes(id)) toggleExpand(id);
    setMobileTab("answer");
  }

  const { boxes: selectedBoxes, tag, tone } = useMemo(() => {
    const q = result.questions.find((q) => q.id === selectedId);
    if (q?.answer) {
      const positive = q.grading ? q.grading.marksAwarded > 0 : true;
      return { boxes: q.answer.boxes, tag: `Q${q.number}`, tone: q.grading ? (positive ? "positive" : "negative") : "neutral" };
    }
    const u = result.unmatchedAnswers.find((u) => u.id === selectedId);
    if (u) return { boxes: u.boxes, tag: "Unmatched", tone: "neutral" };
    return { boxes: [], tag: null, tone: "neutral" };
  }, [selectedId, result]);

  return (
    <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col min-h-0">
      <div className="lg:hidden mb-4 flex bg-slate-200/70 rounded-full p-1 shrink-0">
        <button
          type="button"
          onClick={() => setMobileTab("questions")}
          className={`flex-1 text-sm font-semibold rounded-full py-2 transition ${
            mobileTab === "questions" ? "bg-slate-900 text-white" : "text-slate-600"
          }`}
        >
          Questions
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("answer")}
          className={`flex-1 text-sm font-semibold rounded-full py-2 transition ${
            mobileTab === "answer" ? "bg-slate-900 text-white" : "text-slate-600"
          }`}
        >
          Answer Sheet
        </button>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`min-h-0 overflow-y-auto pb-2 ${mobileTab === "answer" ? "hidden lg:block" : ""}`}>
          <QuestionList
            questions={result.questions}
            selectedId={selectedId}
            expandedIds={expandedIds}
            onSelect={handleSelect}
            onToggleExpand={toggleExpand}
            allExpanded={allExpanded}
            onToggleAll={toggleAll}
          />
          {result.unmatchedAnswers.length > 0 && (
            <UnmatchedAnswers
              answers={result.unmatchedAnswers}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          )}
        </div>
        <div className={`min-h-0 ${mobileTab === "questions" ? "hidden lg:block" : ""}`}>
          <AnswerViewer files={answerFiles} highlightBoxes={selectedBoxes} tag={tag} tone={tone} />
        </div>
      </div>
    </div>
  );
}
