interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-4">

      <button
        onClick={onDecrease}
        className="h-10 w-10 rounded-full border border-white/10 hover:border-[#D4AF37]"
      >
        -
      </button>

      <span className="text-lg font-semibold">
        {quantity}
      </span>

      <button
        onClick={onIncrease}
        className="h-10 w-10 rounded-full border border-white/10 hover:border-[#D4AF37]"
      >
        +
      </button>

    </div>
  );
}