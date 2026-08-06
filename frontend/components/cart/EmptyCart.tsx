
import EmptyState from "@/components/ui/EmptyState";

export default function EmptyCart() {
  return (
    <EmptyState
      title="Your Cart is Empty"
      description="Looks like you haven't added any perfumes yet."
      buttonText="Shop Now"
      buttonLink="/shop"
    />
  );
}