"use client";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">

      <button
        type="button"
        disabled={page === 1}
        onClick={() =>
          onPageChange(Math.max(1, page - 1))
        }
        className="rounded-full border border-white/10 bg-[#111111] px-5 py-2 text-sm text-gray-300 transition hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      <div className="flex flex-wrap items-center justify-center gap-2">

        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() =>
              onPageChange(pageNumber)
            }
            className={`h-9 w-9 rounded-full text-sm transition ${
              page === pageNumber
                ? "bg-[#D4AF37] font-semibold text-black"
                : "border border-white/10 text-gray-400 hover:border-[#D4AF37] hover:text-[#D4AF37]"
            }`}
          >
            {pageNumber}
          </button>
        ))}

      </div>

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() =>
          onPageChange(
            Math.min(totalPages, page + 1)
          )
        }
        className="rounded-full border border-white/10 bg-[#111111] px-5 py-2 text-sm text-gray-300 transition hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>

    </div>
  );
}