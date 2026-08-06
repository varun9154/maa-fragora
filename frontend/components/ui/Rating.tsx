import { Star } from "lucide-react";

interface RatingProps {
  rating: number;
  reviews?: number;
}

export default function Rating({
  rating,
  reviews,
}: RatingProps) {
  return (
    <div className="flex items-center gap-2">

      <Star
        size={18}
        fill="currentColor"
        className="text-[#D4AF37]"
      />

      <span className="font-medium">
        {rating}
      </span>

      {reviews !== undefined && (
        <span className="text-sm text-gray-400">
          ({reviews} Reviews)
        </span>
      )}

    </div>
  );
}