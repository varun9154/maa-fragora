import Link from "next/link";

const menu = [
  {
    title: "My Orders",
    href: "/orders",
  },
  {
    title: "Wishlist",
    href: "/wishlist",
  },
  {
    title: "Cart",
    href: "/cart",
  },
  {
    title: "Checkout",
    href: "/checkout",
  },
];

export default function ProfileMenu() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#111111] p-8">

      <h2 className="mb-6 text-2xl font-bold text-white">
        My Account
      </h2>

      <div className="space-y-4">

        {menu.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="block rounded-xl bg-[#181818] px-5 py-4 text-white transition hover:bg-[#D4AF37] hover:text-black"
          >
            {item.title}
          </Link>
        ))}

      </div>

    </div>
  );
}