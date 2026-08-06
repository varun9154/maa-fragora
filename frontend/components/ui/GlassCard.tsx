import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({
  children,
  className = "",
}: GlassCardProps) {
  return (
    <div
      className={`
        rounded-3xl
        border
        border-white/10
        bg-white/5
        backdrop-blur-lg
        shadow-xl
        transition-all
        duration-300
        hover:border-[#D4AF37]
        hover:shadow-[0_20px_50px_rgba(212,175,55,.15)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}