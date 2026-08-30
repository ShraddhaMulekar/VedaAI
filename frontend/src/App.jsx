import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import UploadForm from "./components/UploadForm";
import LoadingState from "./components/LoadingState";
import ResultsView from "./components/ResultsView";
import AuthForm from "./components/AuthForm";
import { analyzeSheets } from "./api";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const [status, setStatus] = useState("idle"); // idle | login | analyzing | results | error
  const [result, setResult] = useState(null);
  const [answerFiles, setAnswerFiles] = useState([]);
  const [error, setError] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pendingUpload, setPendingUpload] = useState(null);

  async function runAnalysis(questionFiles, files) {
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

  function handleStartMapping(questionFiles, files) {
    if (!user) {
      setPendingUpload({ questionFiles, answerFiles: files });
      setStatus("login");
      return;
    }
    runAnalysis(questionFiles, files);
  }

  // Once the user logs in from the login screen, resume whatever they were trying to do.
  useEffect(() => {
    if (user && status === "login") {
      if (pendingUpload) {
        const { questionFiles, answerFiles: files } = pendingUpload;
        setPendingUpload(null);
        runAnalysis(questionFiles, files);
      } else {
        setStatus("idle");
      }
    }
  }, [user, status]);

  function handleReset() {
    setStatus("idle");
    setResult(null);
    setAnswerFiles([]);
    setError("");
  }

  const collapsed = status === "analyzing" || sidebarCollapsed;

  if (authLoading) {
    return <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-400 text-sm">Loading...</div>;
  }

  if (status === "login") {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 px-4">
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="self-center max-w-md w-full text-sm text-slate-500 hover:text-slate-700 mb-2"
        >
          &larr; Back
        </button>
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-50 to-slate-200">
      <Sidebar collapsed={collapsed} onToggle={() => setSidebarCollapsed((c) => !c)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar showBack={status === "results"} onBack={handleReset} />

        <main className="flex-1 min-h-0 p-4 sm:p-8 flex flex-col overflow-y-auto">
          {(status === "idle" || status === "error") && (
            <UploadForm onAnalyze={handleStartMapping} error={error} />
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
