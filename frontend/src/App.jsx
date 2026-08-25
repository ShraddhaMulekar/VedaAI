import { useState } from "react";
import UploadForm from "./components/UploadForm";
import ResultsView from "./components/ResultsView";
import { analyzeSheets } from "./api";

export default function App() {
  const [status, setStatus] = useState("idle"); // idle | analyzing | results | error
  const [result, setResult] = useState(null);
  const [answerFiles, setAnswerFiles] = useState([]);
  const [error, setError] = useState("");

  async function handleAnalyze(questionFiles, files) {
    setStatus("analyzing");
    setError("");
    setAnswerFiles(files);
    try {
      const data = await analyzeSheets(questionFiles, files);
      setResult(data);
      setStatus("results");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  function handleReset() {
    setStatus("idle");
    setResult(null);
    setAnswerFiles([]);
    setError("");
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">VedaAI</h1>
          <p className="text-xs text-slate-500">Smart Answer Sheet Analysis &amp; AI Evaluation</p>
        </div>
        {status === "results" && (
          <button
            onClick={handleReset}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Analyze another sheet
          </button>
        )}
      </header>

      <main className="p-6">
        {status !== "results" && (
          <UploadForm onAnalyze={handleAnalyze} status={status} error={error} />
        )}
        {status === "results" && result && (
          <ResultsView result={result} answerFiles={answerFiles} />
        )}
      </main>
    </div>
  );
}
