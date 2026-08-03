type Props = {
  title: string;
  image: string;
};

export default function GlassCard({
  title,
  image,
}: Props) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg transition-all duration-500 hover:border-[#D4AF37] hover:shadow-[0_0_40px_rgba(212,175,55,.25)]">

      <img
        src={image}
        alt={title}
        className="h-80 w-full object-cover transition duration-500 group-hover:scale-110"
      />

      <div className="p-6">

        <h3 className="text-2xl font-bold">
          {title}
        </h3>

      </div>

    </div>
  );
}