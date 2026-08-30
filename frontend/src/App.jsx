import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import UploadForm from "./components/UploadForm";
import LoadingState from "./components/LoadingState";
import ResultsView from "./components/ResultsView";
import { analyzeSheets } from "./api";

export default function App() {
  const [status, setStatus] = useState("idle"); // idle | analyzing | results | error
  const [result, setResult] = useState(null);
  const [answerFiles, setAnswerFiles] = useState([]);
  const [error, setError] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  const collapsed = status === "analyzing" || sidebarCollapsed;

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-50 to-slate-200">
      <Sidebar collapsed={collapsed} onToggle={() => setSidebarCollapsed((c) => !c)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar showBack={status === "results"} onBack={handleReset} />

        <main className="flex-1 min-h-0 p-4 sm:p-8 flex flex-col overflow-y-auto">
          {(status === "idle" || status === "error") && (
            <UploadForm onAnalyze={handleAnalyze} error={error} />
          )}
          {status === "analyzing" && <LoadingState />}
          {status === "results" && result && (
            <ResultsView result={result} answerFiles={answerFiles} />
          )}
        </main>
      </div>
    </div>
  );
}
