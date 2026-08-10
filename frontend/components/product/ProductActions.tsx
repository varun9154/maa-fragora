"use client";

import { ShoppingCart, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import useCart from "@/hooks/useCart";
import { useCartStore } from "@/store/cartStore";

interface ProductActionsProps {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  stock: number;
}

export default function ProductActions({
  id,
  slug,
  name,
  image,
  price,
  stock,
}: ProductActionsProps) {
  const router = useRouter();

  const { addMutation } = useCart();

  const addToCartStore =
    useCartStore(
      (state) => state.addToCart
    );

  const handleAddToCart = async () => {
    if (stock <= 0) {
      toast.error(
        "This product is out of stock"
      );
      return;
    }

    try {
      /*
       * First update backend.
       *
       * Only update Zustand after
       * backend succeeds.
       */
      await addMutation.mutateAsync({
        productId: id,
        quantity: 1,
      });

      /*
       * Update local cart
       */
      addToCartStore({
        id,
        slug,
        name,
        image,
        price,
        quantity: 1,
      });

      toast.success(
        `${name} added to cart`
      );
    } catch (error) {
      console.error(
        "Add to Cart Error:",
        error
      );

      toast.error(
        "Unable to add product to cart"
      );
    }
  };

  const handleBuyNow = async () => {
    if (stock <= 0) {
      toast.error(
        "This product is out of stock"
      );
      return;
    }

    try {
      await addMutation.mutateAsync({
        productId: id,
        quantity: 1,
      });

      addToCartStore({
        id,
        slug,
        name,
        image,
        price,
        quantity: 1,
      });

      router.push("/checkout");
    } catch (error) {
      console.error(
        "Buy Now Error:",
        error
      );

      toast.error(
        "Unable to continue"
      );
    }
  };

  return (
    <div className="mt-10 flex flex-col gap-4 sm:flex-row">

      {/* ADD TO CART */}

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={
          stock <= 0 ||
          addMutation.isPending
        }
        className={`flex flex-1 items-center justify-center gap-2 rounded-full py-4 text-lg font-bold transition ${
          stock <= 0 ||
          addMutation.isPending
            ? "cursor-not-allowed bg-gray-700 text-gray-400"
            : "bg-[#D4AF37] text-black hover:scale-[1.02]"
        }`}
      >
        <ShoppingCart size={20} />

        {addMutation.isPending
          ? "Adding..."
          : stock <= 0
          ? "Out of Stock"
          : "Add To Cart"}
      </button>

      {/* BUY NOW */}

      <button
        type="button"
        onClick={handleBuyNow}
        disabled={
          stock <= 0 ||
          addMutation.isPending
        }
        className={`flex items-center justify-center gap-2 rounded-full border border-[#D4AF37] px-8 py-4 font-bold transition ${
          stock <= 0 ||
          addMutation.isPending
            ? "cursor-not-allowed border-gray-700 text-gray-500"
            : "text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
        }`}
      >
        <Zap size={19} />

        Buy Now
      </button>

    </div>
  );
}