import { useEffect, useState } from "react";
import Dropzone from "./Dropzone";

const STAGES = [
  "Uploading files...",
  "Reading question paper...",
  "Reading handwritten answers...",
  "Matching answers to questions...",
  "Grading & generating feedback...",
];

export default function UploadForm({ onAnalyze, status, error }) {
  const [questionFiles, setQuestionFiles] = useState([]);
  const [answerFiles, setAnswerFiles] = useState([]);
  const [stageIndex, setStageIndex] = useState(0);
  const analyzing = status === "analyzing";

  useEffect(() => {
    if (!analyzing) {
      setStageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setStageIndex((i) => Math.min(i + 1, STAGES.length - 1));
    }, 2200);
    return () => clearInterval(interval);
  }, [analyzing]);

  function handleSubmit(e) {
    e.preventDefault();
    if (questionFiles.length === 0 || answerFiles.length === 0) return;
    onAnalyze(questionFiles, answerFiles);
  }

  const canSubmit = questionFiles.length > 0 && answerFiles.length > 0 && !analyzing;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Dropzone
          label="Question paper"
          hint="PDF or images, printed question paper"
          files={questionFiles}
          onChange={setQuestionFiles}
          disabled={analyzing}
        />
        <Dropzone
          label="Student answer sheet"
          hint="PDF or images, handwritten answers"
          files={answerFiles}
          onChange={setAnswerFiles}
          disabled={analyzing}
        />
      </div>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </p>
      )}

      <div className="mt-6 flex items-center gap-4">
        <button
          type="submit"
          disabled={!canSubmit}
          className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700 transition"
        >
          {analyzing ? "Analyzing..." : "Analyze"}
        </button>

        {analyzing && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            {STAGES[stageIndex]}
          </div>
        )}
      </div>
    </form>
  );
}
