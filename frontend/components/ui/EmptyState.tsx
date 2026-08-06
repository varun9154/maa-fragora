import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export default function EmptyState({
  title,
  description,
  buttonText,
  buttonLink,
}: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#111111] p-16 text-center">

      <h2 className="text-4xl font-bold">
        {title}
      </h2>

      <p className="mt-4 text-gray-400">
        {description}
      </p>

      <Link
        href={buttonLink}
        className="mt-8 inline-block rounded-full bg-[#D4AF37] px-8 py-4 font-semibold text-black transition hover:scale-105"
      >
        {buttonText}
      </Link>

    </div>
  );
}