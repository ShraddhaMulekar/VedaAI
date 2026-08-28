import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function isPdf(file) {
  return file.type === "application/pdf";
}

function Highlights({ boxes }) {
  return boxes.map((b, i) => (
    <div
      key={i}
      className="absolute border-2 border-amber-400 bg-amber-300/30 rounded-sm pointer-events-none"
      style={{
        top: `${b.ymin / 10}%`,
        left: `${b.xmin / 10}%`,
        width: `${(b.xmax - b.xmin) / 10}%`,
        height: `${(b.ymax - b.ymin) / 10}%`,
      }}
    />
  ));
}

export default function AnswerViewer({ files, highlightBoxes }) {
  const [pdfPageCounts, setPdfPageCounts] = useState({});
  const pageRefs = useRef({});

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
    return offsets;
  }, [files, pdfPageCounts]);

  useEffect(() => {
    const firstPage = highlightBoxes[0]?.page;
    if (firstPage && pageRefs.current[firstPage]) {
      pageRefs.current[firstPage].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlightBoxes]);

  function boxesForPage(pageNumber) {
    return highlightBoxes.filter((b) => b.page === pageNumber);
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 max-h-[80vh] overflow-y-auto">
      {files.length === 0 && <p className="text-sm text-slate-400">No answer sheet loaded.</p>}

      {files.map((file, fileIndex) => {
        const startPage = fileOffsets[fileIndex];

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
                    className="relative border border-slate-100 rounded-lg overflow-hidden mb-4 last:mb-0"
                  >
                    <Page
                      pageNumber={pageInFile}
                      width={640}
                      renderAnnotationLayer={false}
                      renderTextLayer={false}
                    />
                    <Highlights boxes={boxesForPage(globalPage)} />
                    <span className="absolute top-2 left-2 text-[10px] px-1.5 py-0.5 rounded bg-black/50 text-white">
                      Page {globalPage}
                    </span>
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
            className="relative border border-slate-100 rounded-lg overflow-hidden mb-4 last:mb-0"
          >
            <img src={urls[fileIndex]} alt={`Answer sheet page ${globalPage}`} className="w-full" />
            <Highlights boxes={boxesForPage(globalPage)} />
            <span className="absolute top-2 left-2 text-[10px] px-1.5 py-0.5 rounded bg-black/50 text-white">
              Page {globalPage}
            </span>
          </div>
        );
      })}
    </div>
  );
}
