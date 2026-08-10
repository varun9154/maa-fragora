interface Props {
  title: string;
  value: string;
}

export default function StatCard({
  title,
  value,
}: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#111111] p-6">

      <p className="text-gray-400">
        {title}
      </p>

      <h2 className="mt-4 text-4xl font-bold text-[#D4AF37]">
        {value}
      </h2>

    </div>
  );
}