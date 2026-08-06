interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

export default function SectionTitle({
  title,
  subtitle,
}: SectionTitleProps) {
  return (
    <div className="mb-12 text-center">

      {subtitle && (
        <p className="uppercase tracking-[6px] text-[#D4AF37]">
          {subtitle}
        </p>
      )}

      <h2 className="mt-4 text-5xl font-bold">
        {title}
      </h2>

    </div>
  );
}