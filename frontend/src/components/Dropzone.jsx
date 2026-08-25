export default function Dropzone({ label, hint, files, onChange, disabled }) {
  const inputId = `file-${label.replace(/\s+/g, "-").toLowerCase()}`;

  function handleFiles(fileList) {
    onChange(Array.from(fileList));
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div
        className={`rounded-xl border-2 border-dashed p-6 text-center transition ${
          disabled ? "opacity-50 border-slate-200" : "border-slate-300 hover:border-indigo-400"
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (disabled) return;
          handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg"
          disabled={disabled}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          id={inputId}
        />
        <label
          htmlFor={inputId}
          className={`block ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          <p className="text-sm text-slate-500">{hint}</p>
          <p className="mt-2 text-sm font-medium text-indigo-600">
            Click to choose files or drag &amp; drop
          </p>
        </label>
      </div>
      {files.length > 0 && (
        <ul className="mt-2 text-xs text-slate-600 space-y-0.5">
          {files.map((f, i) => (
            <li key={i} className="truncate">
              {f.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
