interface PriceProps {
  price: number;
  oldPrice?: number;
}

export default function Price({
  price,
  oldPrice,
}: PriceProps) {
  return (
    <div className="flex items-center gap-3">

      <span className="text-2xl font-bold text-[#D4AF37]">
        ₹{price}
      </span>

      {oldPrice && (
        <span className="text-gray-500 line-through">
          ₹{oldPrice}
        </span>
      )}

    </div>
  );
}