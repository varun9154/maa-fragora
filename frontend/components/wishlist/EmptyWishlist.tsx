import Link from "next/link";

export default function EmptyWishlist() {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center text-center">

      <h2 className="text-4xl font-bold text-white">
        Your Wishlist is Empty
      </h2>

      <p className="mt-4 max-w-lg text-gray-400">
        Save your favourite perfumes here and purchase them later.
      </p>

      <Link
        href="/shop"
        className="mt-8 rounded-full bg-[#D4AF37] px-8 py-4 font-semibold text-black transition hover:opacity-90"
      >
        Continue Shopping
      </Link>

    </div>
  );
}