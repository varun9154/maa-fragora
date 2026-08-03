type Props = {
  children: React.ReactNode;
};

export default function Badge({ children }: Props) {
  return (
    <span className="rounded-full border border-[#D4AF37] px-4 py-1 text-xs tracking-[3px] text-[#D4AF37] uppercase">
      {children}
    </span>
  );
}