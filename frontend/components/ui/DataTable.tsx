"use client";

import {
  ReactNode,
  useMemo,
  useState,
} from "react";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];

  rowKey: (item: T) => string;

  loading?: boolean;

  emptyMessage?: string;

  pageSize?: number;

  search?: string;

  searchPlaceholder?: string;

  onSearch?: (value: string) => void;
}

export default function DataTable<T>({
  columns,
  data,
  rowKey,
  loading = false,
  emptyMessage = "No records found",
  pageSize = 10,
  search = "",
  searchPlaceholder = "Search...",
  onSearch,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);

  const [sortKey, setSortKey] =
    useState<string | null>(null);

  const [sortDirection, setSortDirection] =
    useState<"asc" | "desc">("asc");

  /* -------------------------------------------------- */
  /* Sorting */
  /* -------------------------------------------------- */

  const sortedData = useMemo(() => {
    if (!sortKey) {
      return data;
    }

    const sorted = [...data].sort((a, b) => {
      const aValue = (a as Record<string, unknown>)[
        sortKey
      ];

      const bValue = (b as Record<string, unknown>)[
        sortKey
      ];

      if (aValue === undefined || aValue === null) {
        return 1;
      }

      if (bValue === undefined || bValue === null) {
        return -1;
      }

      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();

      if (aString < bString) {
        return sortDirection === "asc" ? -1 : 1;
      }

      if (aString > bString) {
        return sortDirection === "asc" ? 1 : -1;
      }

      return 0;
    });

    return sorted;
  }, [data, sortKey, sortDirection]);

  /* -------------------------------------------------- */
  /* Pagination */
  /* -------------------------------------------------- */

  const totalPages = Math.max(
    1,
    Math.ceil(sortedData.length / pageSize)
  );

  const currentPage = Math.min(page, totalPages);

  const startIndex =
    (currentPage - 1) * pageSize;

  const endIndex =
    startIndex + pageSize;

  const currentData = sortedData.slice(
    startIndex,
    endIndex
  );

  /* -------------------------------------------------- */
  /* Sorting Handler */
  /* -------------------------------------------------- */

  const handleSort = (column: DataTableColumn<T>) => {
    if (!column.sortable) {
      return;
    }

    if (sortKey === column.key) {
      setSortDirection((current) =>
        current === "asc" ? "desc" : "asc"
      );
    } else {
      setSortKey(column.key);
      setSortDirection("asc");
    }

    setPage(1);
  };

  /* -------------------------------------------------- */
  /* Search */
  /* -------------------------------------------------- */

  const handleSearch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    setPage(1);

    if (onSearch) {
      onSearch(value);
    }
  };

  /* -------------------------------------------------- */
  /* Loading */
  /* -------------------------------------------------- */

  if (loading) {
    return (
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111111]">
        <div className="space-y-4 p-6">

          {Array.from({ length: 6 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-14 animate-pulse rounded-xl bg-white/5"
              />
            )
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="w-full">

      {/* Search */}

      {onSearch && (
        <div className="mb-6">

          <div className="relative max-w-md">

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              <circle
                cx="11"
                cy="11"
                r="8"
              />

              <path d="m21 21-4.3-4.3" />
            </svg>

            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder={searchPlaceholder}
              className="w-full rounded-full border border-white/10 bg-[#111111] py-3 pl-11 pr-5 text-white outline-none transition placeholder:text-gray-600 focus:border-[#D4AF37]"
            />

          </div>

        </div>
      )}

      {/* Desktop Table */}

      <div className="hidden overflow-hidden rounded-3xl border border-white/10 bg-[#111111] md:block">

        <div className="overflow-x-auto">

          <table className="w-full border-collapse">

            <thead>

              <tr className="border-b border-white/10">

                {columns.map((column) => (

                  <th
                    key={column.key}
                    onClick={() =>
                      handleSort(column)
                    }
                    className={`whitespace-nowrap px-6 py-5 text-left text-sm font-semibold text-gray-400 ${
                      column.sortable
                        ? "cursor-pointer select-none hover:text-[#D4AF37]"
                        : ""
                    } ${column.className || ""}`}
                  >

                    <div className="flex items-center gap-2">

                      <span>
                        {column.header}
                      </span>

                      {column.sortable &&
                        sortKey === column.key && (
                          <span className="text-[#D4AF37]">
                            {sortDirection === "asc"
                              ? "↑"
                              : "↓"}
                          </span>
                        )}

                    </div>

                  </th>

                ))}

              </tr>

            </thead>

            <tbody>

              {currentData.length === 0 ? (

                <tr>

                  <td
                    colSpan={columns.length}
                    className="px-6 py-16 text-center text-gray-500"
                  >
                    {emptyMessage}
                  </td>

                </tr>

              ) : (

                currentData.map((item) => (

                  <tr
                    key={rowKey(item)}
                    className="border-b border-white/5 transition hover:bg-white/[0.03]"
                  >

                    {columns.map((column) => (

                      <td
                        key={column.key}
                        className="px-6 py-5 text-sm text-gray-300"
                      >

                        {column.render
                          ? column.render(item)
                          : String(
                              (
                                item as Record<
                                  string,
                                  unknown
                                >
                              )[column.key] ?? "-"
                            )}

                      </td>

                    ))}

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Mobile Cards */}

      <div className="space-y-4 md:hidden">

        {currentData.length === 0 ? (

          <div className="rounded-3xl border border-white/10 bg-[#111111] px-6 py-16 text-center text-gray-500">
            {emptyMessage}
          </div>

        ) : (

          currentData.map((item) => (

            <div
              key={rowKey(item)}
              className="rounded-3xl border border-white/10 bg-[#111111] p-5"
            >

              <div className="space-y-4">

                {columns.map((column) => (

                  <div
                    key={column.key}
                    className="flex items-start justify-between gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0"
                  >

                    <span className="text-sm text-gray-500">
                      {column.header}
                    </span>

                    <div className="text-right text-sm text-gray-200">
                      {column.render
                        ? column.render(item)
                        : String(
                            (
                              item as Record<
                                string,
                                unknown
                              >
                            )[column.key] ?? "-"
                          )}
                    </div>

                  </div>

                ))}

              </div>

            </div>

          ))

        )}

      </div>

      {/* Pagination */}

      {sortedData.length > pageSize && (

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-gray-500">

            Showing{" "}
            <span className="text-gray-300">
              {startIndex + 1}
            </span>{" "}
            -
            <span className="text-gray-300">
              {" "}
              {Math.min(
                endIndex,
                sortedData.length
              )}
            </span>{" "}
            of{" "}
            <span className="text-gray-300">
              {sortedData.length}
            </span>

          </p>

          <div className="flex items-center gap-2">

            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() =>
                setPage((current) =>
                  Math.max(1, current - 1)
                )
              }
              className="rounded-full border border-white/10 bg-[#111111] px-4 py-2 text-sm text-gray-300 transition hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <div className="flex items-center gap-1">

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              )
                .slice(
                  Math.max(0, currentPage - 3),
                  Math.min(
                    totalPages,
                    currentPage + 2
                  )
                )
                .map((pageNumber) => (

                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() =>
                      setPage(pageNumber)
                    }
                    className={`h-9 w-9 rounded-full text-sm transition ${
                      currentPage === pageNumber
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
              disabled={
                currentPage === totalPages
              }
              onClick={() =>
                setPage((current) =>
                  Math.min(
                    totalPages,
                    current + 1
                  )
                )
              }
              className="rounded-full border border-white/10 bg-[#111111] px-4 py-2 text-sm text-gray-300 transition hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>

          </div>

        </div>

      )}

    </div>
  );
}