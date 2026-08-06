import Link from "next/link";

export default function EmptyOrders() {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center text-center">

      <h2 className="text-4xl font-bold">
        No Orders Yet
      </h2>

      <p className="mt-4 text-gray-400">
        Your placed orders will appear here.
      </p>

      <Link
        href="/shop"
        className="mt-8 rounded-full bg-[#D4AF37] px-8 py-4 font-semibold text-black"
      >
        Shop Now
      </Link>

    </div>
  );
}