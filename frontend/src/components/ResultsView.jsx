import { useMemo, useState } from "react";
import ScoreSummary from "./ScoreSummary";
import QuestionList from "./QuestionList";
import UnmatchedAnswers from "./UnmatchedAnswers";
import AnswerViewer from "./AnswerViewer";

export default function ResultsView({ result, answerFiles }) {
  const [selectedId, setSelectedId] = useState(null);

  const selectedBoxes = useMemo(() => {
    const q = result.questions.find((q) => q.id === selectedId);
    if (q?.answer) return q.answer.boxes;
    const u = result.unmatchedAnswers.find((u) => u.id === selectedId);
    if (u) return u.boxes;
    return [];
  }, [selectedId, result]);

  return (
    <div className="max-w-7xl mx-auto">
      <ScoreSummary summary={result.summary} />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <QuestionList questions={result.questions} selectedId={selectedId} onSelect={setSelectedId} />
          {result.unmatchedAnswers.length > 0 && (
            <UnmatchedAnswers
              answers={result.unmatchedAnswers}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          )}
        </div>
        <div>
          <AnswerViewer files={answerFiles} highlightBoxes={selectedBoxes} />
        </div>
      </div>
    </div>
  );
}
