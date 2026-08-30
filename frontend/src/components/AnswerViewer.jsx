import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const BASE_WIDTH = 640;
const TONE_CLASSES = {
  positive: "border-emerald-500 bg-emerald-400/20",
  negative: "border-rose-500 bg-rose-400/20",
  neutral: "border-brand-500 bg-brand-400/20",
};
const TAG_TONE_CLASSES = {
  positive: "bg-emerald-500",
  negative: "bg-rose-500",
  neutral: "bg-brand-500",
};

function isPdf(file) {
  return file.type === "application/pdf";
}

function Highlights({ boxes, tag, tone }) {
  return boxes.map((b, i) => (
    <div
      key={i}
      className={`absolute border-2 rounded-sm pointer-events-none ${TONE_CLASSES[tone] ?? TONE_CLASSES.neutral}`}
      style={{
        top: `${b.ymin / 10}%`,
        left: `${b.xmin / 10}%`,
        width: `${(b.xmax - b.xmin) / 10}%`,
        height: `${(b.ymax - b.ymin) / 10}%`,
      }}
    >
      {i === 0 && tag && (
        <span
          className={`absolute -top-3 left-0 text-[10px] font-bold text-white px-1.5 py-0.5 rounded ${
            TAG_TONE_CLASSES[tone] ?? TAG_TONE_CLASSES.neutral
          }`}
        >
          {tag}
        </span>
      )}
    </div>
  ));
}

export default function AnswerViewer({ files, highlightBoxes, tag, tone }) {
  const [pdfPageCounts, setPdfPageCounts] = useState({});
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const pageRefs = useRef({});
  const scrollRef = useRef(null);
  const [fitWidth, setFitWidth] = useState(BASE_WIDTH);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setFitWidth(Math.min(BASE_WIDTH, entry.contentRect.width));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const [urls, setUrls] = useState([]);
  useEffect(() => {
    const created = files.map((f) => URL.createObjectURL(f));
    setUrls(created);
    return () => created.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  const fileOffsets = useMemo(() => {
    const offsets = [];
    let counter = 1;
    files.forEach((file, i) => {
      offsets[i] = counter;
      counter += isPdf(file) ? pdfPageCounts[i] ?? 1 : 1;
    });
    return counter > 1 ? { offsets, totalPages: counter - 1 } : { offsets, totalPages: 0 };
  }, [files, pdfPageCounts]);

  useEffect(() => {
    const firstPage = highlightBoxes[0]?.page;
    if (firstPage) {
      setCurrentPage(firstPage);
      pageRefs.current[firstPage]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlightBoxes]);

  function goToPage(page) {
    const clamped = Math.min(Math.max(page, 1), fileOffsets.totalPages || 1);
    setCurrentPage(clamped);
    pageRefs.current[clamped]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function boxesForPage(pageNumber) {
    return highlightBoxes.filter((b) => b.page === pageNumber);
  }

  const renderWidth = (fitWidth * zoom) / 100;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="bg-slate-900 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <span className="font-semibold text-sm">Answer Sheet</span>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 bg-white/10 rounded-full px-1 py-1">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(50, z - 10))}
              className="h-6 w-6 rounded-full flex items-center justify-center hover:bg-white/10"
              aria-label="Zoom out"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="text-xs w-10 text-center tabular-nums">{zoom}%</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(200, z + 10))}
              className="h-6 w-6 rounded-full flex items-center justify-center hover:bg-white/10"
              aria-label="Zoom in"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          {fileOffsets.totalPages > 0 && (
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-1 py-1">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                className="h-6 w-6 rounded-full flex items-center justify-center hover:bg-white/10 disabled:opacity-30"
                disabled={currentPage <= 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <span className="text-xs whitespace-nowrap">
                Page {currentPage} of {fileOffsets.totalPages}
              </span>
              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                className="h-6 w-6 rounded-full flex items-center justify-center hover:bg-white/10 disabled:opacity-30"
                disabled={currentPage >= fileOffsets.totalPages}
                aria-label="Next page"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 min-h-0 overflow-auto p-4 bg-slate-50">
        {files.length === 0 && <p className="text-sm text-slate-400">No answer sheet loaded.</p>}

        {files.map((file, fileIndex) => {
          const startPage = fileOffsets.offsets[fileIndex];

          if (isPdf(file)) {
            const count = pdfPageCounts[fileIndex] ?? 1;
            return (
              <Document
                key={fileIndex}
                file={urls[fileIndex]}
                onLoadSuccess={({ numPages }) =>
                  setPdfPageCounts((prev) =>
                    prev[fileIndex] === numPages ? prev : { ...prev, [fileIndex]: numPages }
                  )
                }
                loading={<div className="p-8 text-sm text-slate-400">Loading page...</div>}
              >
                {Array.from({ length: count }, (_, i) => i + 1).map((pageInFile) => {
                  const globalPage = startPage + pageInFile - 1;
                  return (
                    <div
                      key={pageInFile}
                      ref={(el) => (pageRefs.current[globalPage] = el)}
                      className="relative border border-slate-200 rounded-lg overflow-hidden mb-4 last:mb-0 mx-auto bg-white"
                      style={{ width: renderWidth }}
                    >
                      <Page
                        pageNumber={pageInFile}
                        width={renderWidth}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                      />
                      <Highlights boxes={boxesForPage(globalPage)} tag={tag} tone={tone} />
                    </div>
                  );
                })}
              </Document>
            );
          }

          const globalPage = startPage;
          return (
            <div
              key={fileIndex}
              ref={(el) => (pageRefs.current[globalPage] = el)}
              className="relative border border-slate-200 rounded-lg overflow-hidden mb-4 last:mb-0 mx-auto bg-white"
              style={{ width: renderWidth }}
            >
              <img src={urls[fileIndex]} alt={`Answer sheet page ${globalPage}`} className="w-full block" />
              <Highlights boxes={boxesForPage(globalPage)} tag={tag} tone={tone} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
