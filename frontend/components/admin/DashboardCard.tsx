interface Props {
  title: string;
  value: string | number;
}

export default function DashboardCard({
  title,
  value,
}: Props) {
  return (
    <div className="rounded-3xl bg-[#111111] p-8 border border-[#D4AF37]/20">

      <h3 className="text-gray-400">

        {title}

      </h3>

      <h1 className="mt-4 text-5xl font-bold text-[#D4AF37]">

        {value}

      </h1>

    </div>
  );
}