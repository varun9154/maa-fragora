"use client";

export default function ScrollToTop() {
  const scrollTop = () =>
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  return (
    <button
      onClick={scrollTop}
      className="fixed bottom-28 right-6 rounded-full bg-[#D4AF37] p-4 text-black shadow-lg transition hover:scale-110"
    >
      ↑
    </button>
  );
}