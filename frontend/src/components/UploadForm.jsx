import { useState } from "react";
import { ArrowRight, Sparkles, Clock, BookOpen, Bell } from "lucide-react";
import Dropzone from "./Dropzone";
import teacherPhoto from "../assets/teacher.jpg";

export default function UploadForm({ onAnalyze, error }) {
  const [questionFiles, setQuestionFiles] = useState([]);
  const [answerFiles, setAnswerFiles] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    if (questionFiles.length === 0 || answerFiles.length === 0) return;
    onAnalyze(questionFiles, answerFiles);
  }

  const canSubmit = questionFiles.length > 0 && answerFiles.length > 0;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto text-center py-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
        Upload{" "}
        <span className="inline-block bg-brand-50 text-brand-600 px-3 py-1 rounded-xl align-middle">
          Question Paper &amp; Answer Sheets
        </span>
      </h1>
      <p className="mt-4 text-slate-500">Upload both files to get started</p>

      <div className="mt-8 flex justify-center">
        <div className="relative h-40 w-40 rounded-full bg-brand-50 flex items-center justify-center">
          <div className="absolute inset-3 rounded-full bg-brand-100" />
          <span className="relative h-24 w-24 rounded-full ring-4 ring-white shadow-sm overflow-hidden">
            <img src={teacherPhoto} alt="Teacher" className="h-full w-full object-cover" />
          </span>
          <Badge icon={Clock} className="top-1 right-4" />
          <Badge icon={BookOpen} className="top-8 -left-1" />
          <Badge icon={Bell} className="bottom-1 right-2" />
          <Badge icon={Sparkles} className="bottom-8 -right-1" />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
        <Dropzone
          label="Upload"
          accentLabel="Question Paper"
          files={questionFiles}
          onChange={setQuestionFiles}
        />
        <Dropzone
          label="Upload"
          accentLabel="Answer Sheet"
          files={answerFiles}
          onChange={setAnswerFiles}
        />
      </div>

      {error && (
        <p className="mt-6 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </p>
      )}

      <div className="mt-8">
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white font-semibold disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-slate-800 transition"
        >
          Start Mapping
          <ArrowRight className="h-4 w-4" />
        </button>
        <p className="mt-4 text-sm text-slate-400">
          Once both files are uploaded, you'll able to map answers with questions
        </p>
      </div>
    </form>
  );
}

function Badge({ icon: Icon, className }) {
  return (
    <span
      className={`absolute h-6 w-6 rounded-full bg-brand-500 text-white flex items-center justify-center shadow ${className}`}
    >
      <Icon className="h-3 w-3" />
    </span>
  );
}
