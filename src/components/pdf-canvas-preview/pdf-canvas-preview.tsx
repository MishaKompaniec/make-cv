"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

type PdfCanvasPreviewProps = {
  url: string;
  className?: string;
  pageNumber?: number;
  onNumPagesChange?: (numPages: number) => void;
};

export function PdfCanvasPreview({
  url,
  className,
  pageNumber = 1,
  onNumPagesChange,
}: PdfCanvasPreviewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Ensure the worker version matches the runtime pdf.js version.
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect?.width ?? 0;
      setWidth(next > 0 ? Math.floor(next) : 0);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className}>
      <Document
        file={url}
        loading={null}
        error={null}
        onLoadSuccess={({ numPages }) => {
          onNumPagesChange?.(numPages);
        }}
      >
        {width > 0 ? (
          <Page
            pageNumber={pageNumber}
            width={width}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            loading={null}
            error={null}
          />
        ) : null}
      </Document>
    </div>
  );
}
