"use client";

interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  pending:
    "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",

  processing:
    "border-blue-500/30 bg-blue-500/10 text-blue-400",

  shipped:
    "border-purple-500/30 bg-purple-500/10 text-purple-400",

  delivered:
    "border-green-500/30 bg-green-500/10 text-green-400",

  cancelled:
    "border-red-500/30 bg-red-500/10 text-red-400",

  active:
    "border-green-500/30 bg-green-500/10 text-green-400",

  inactive:
    "border-gray-500/30 bg-gray-500/10 text-gray-400",

  approved:
    "border-green-500/30 bg-green-500/10 text-green-400",

  rejected:
    "border-red-500/30 bg-red-500/10 text-red-400",

  paid:
    "border-green-500/30 bg-green-500/10 text-green-400",

  failed:
    "border-red-500/30 bg-red-500/10 text-red-400",
};

function formatStatus(status: string) {
  return status
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  const normalizedStatus = status
    .trim()
    .toLowerCase();

  const style =
    statusStyles[normalizedStatus] ||
    "border-white/10 bg-white/5 text-gray-300";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${style}`}
    >
      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-current" />

      {formatStatus(status)}
    </span>
  );
}