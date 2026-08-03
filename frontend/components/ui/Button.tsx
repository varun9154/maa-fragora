type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "outline";
};

export default function Button({
  children,
  variant = "primary",
}: ButtonProps) {
  const base =
    "rounded-full px-8 py-4 font-semibold transition-all duration-300";

  const styles =
    variant === "primary"
      ? "bg-[#D4AF37] text-black hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,.45)]"
      : "border border-[#D4AF37] text-white hover:bg-[#D4AF37] hover:text-black";

  return <button className={`${base} ${styles}`}>{children}</button>;
}