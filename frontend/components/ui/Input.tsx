import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: Props) {
  return (
    <input
      {...props}
      className="w-full rounded-full border border-white/10 bg-[#111111] px-6 py-4 text-white outline-none transition focus:border-[#D4AF37]"
    />
  );
}