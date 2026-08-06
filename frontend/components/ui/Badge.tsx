interface BadgeProps {
  children: React.ReactNode;
}

export default function Badge({
  children,
}: BadgeProps) {
  return (
    <span className="rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-bold text-black">
      {children}
    </span>
  );
}