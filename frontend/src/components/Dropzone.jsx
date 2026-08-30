import { Upload, X, FileText } from "lucide-react";

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export default function Dropzone({ label, accentLabel, files, onChange, disabled }) {
  const inputId = `file-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const file = files[0] ?? null;

  function handleFiles(fileList) {
    const picked = Array.from(fileList);
    if (picked.length) onChange(picked);
  }

  function removeFile() {
    onChange([]);
  }

  return (
    <div
      className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-6 min-h-[172px] flex items-center justify-center transition"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        if (disabled || file) return;
        handleFiles(e.dataTransfer.files);
      }}
    >
      <input
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        disabled={disabled}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
        id={inputId}
      />

      {!file ? (
        <label
          htmlFor={inputId}
          className={`flex flex-col items-center gap-3 text-center ${
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
        >
          <span className="h-11 w-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Upload className="h-5 w-5" />
          </span>
          <span className="font-semibold text-slate-900">
            {label} <span className="text-brand-500">{accentLabel}</span>
          </span>
          <span className="text-xs text-slate-400">Max 10MB</span>
        </label>
      ) : (
        <div className="w-full relative rounded-xl bg-slate-50 px-4 py-3.5 flex items-center gap-3">
          <span className="h-9 w-9 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
            <FileText className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 text-sm truncate">{file.name}</p>
            <p className="text-xs text-slate-400">{formatSize(file.size)}</p>
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={removeFile}
              aria-label="Remove file"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
