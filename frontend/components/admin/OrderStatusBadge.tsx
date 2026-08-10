interface Props {
  status:
    | "Pending"
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Cancelled"
    | string;
}

export default function OrderStatusBadge({
  status,
}: Props) {
  const styles: Record<string, string> = {
    Pending:
      "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",

    Processing:
      "bg-blue-500/20 text-blue-400 border border-blue-500/30",

    Shipped:
      "bg-purple-500/20 text-purple-400 border border-purple-500/30",

    Delivered:
      "bg-green-500/20 text-green-400 border border-green-500/30",

    Cancelled:
      "bg-red-500/20 text-red-400 border border-red-500/30",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
        styles[status] ||
        "bg-gray-700 text-gray-300"
      }`}
    >
      {status}
    </span>
  );
}