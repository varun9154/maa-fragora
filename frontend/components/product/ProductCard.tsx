import Image from "next/image";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Button from "@/components/ui/Button";

type ProductCardProps = {
  name: string;
  image: string;
  price: number;
  oldPrice: number;
};

export default function ProductCard({
  name,
  image,
  price,
  oldPrice,
}: ProductCardProps) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-white/10 bg-[#111] transition duration-500 hover:border-[#D4AF37] hover:shadow-[0_0_40px_rgba(212,175,55,.25)]">
      <div className="relative overflow-hidden">

        <Image
          src={image}
          alt={name}
          width={500}
          height={500}
          className="h-80 w-full object-cover transition duration-500 group-hover:scale-110"
        />

        <button className="absolute right-4 top-4 rounded-full bg-black/60 p-2 backdrop-blur">
          <Heart size={18} />
        </button>

      </div>

      <div className="space-y-3 p-6">

        <h3 className="text-2xl font-bold">{name}</h3>

        <div className="flex text-[#D4AF37] gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={18}
              fill="currentColor"
            />
          ))}
        </div>

        <div className="flex items-center gap-3">

          <span className="text-2xl font-bold text-[#D4AF37]">
            ₹{price}
          </span>

          <span className="text-gray-500 line-through">
            ₹{oldPrice}
          </span>

        </div>

        <div className="flex gap-3">

          <Button>
            Add to Cart
          </Button>

          <button className="rounded-full border border-[#D4AF37] p-3 transition hover:bg-[#D4AF37] hover:text-black">
            <ShoppingCart size={20} />
          </button>

        </div>

      </div>
    </div>
  );
}