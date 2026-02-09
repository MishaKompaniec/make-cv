"use client";

type PaginationProps = {
  numPages: number;
  pageNumber: number;
  onPageChange: (page: number) => void;
  isGenerating: boolean;
  hasBlob: boolean;
  className?: string;
  pageButtonClassName?: string;
  activeClassName?: string;
};

export function Pagination({
  numPages,
  pageNumber,
  onPageChange,
  isGenerating,
  hasBlob,
  className,
  pageButtonClassName,
  activeClassName,
}: PaginationProps) {
  if (numPages <= 1) return null;

  const disabled = isGenerating || !hasBlob;

  const getButtonClassName = (isActive: boolean) => {
    const base = pageButtonClassName ?? "";
    const active = isActive && activeClassName ? ` ${activeClassName}` : "";
    return `${base}${active}`.trim();
  };

  return (
    <div className={className}>
      {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
        <button
          key={pageNum}
          type="button"
          className={getButtonClassName(pageNumber === pageNum)}
          onClick={() => onPageChange(pageNum)}
          disabled={disabled}
        >
          {pageNum}
        </button>
      ))}
    </div>
  );
}
