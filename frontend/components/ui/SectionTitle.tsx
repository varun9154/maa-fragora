type Props = {
  title: string;
  subtitle?: string;
};

export default function SectionTitle({
  title,
  subtitle,
}: Props) {
  return (
    <div className="mb-14 text-center">
      <p className="tracking-[8px] uppercase text-[#D4AF37]">
        {subtitle}
      </p>

      <h2 className="mt-3 text-5xl font-bold">
        {title}
      </h2>
    </div>
  );
}