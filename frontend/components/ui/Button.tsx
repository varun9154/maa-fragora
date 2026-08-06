import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-[#D4AF37] text-black hover:opacity-90",

    secondary:
      "bg-white text-black hover:bg-gray-200",

    outline:
      "border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black",

    danger:
      "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      className={`
        rounded-full
        px-6
        py-3
        font-semibold
        transition
        duration-300
        ${fullWidth ? "w-full" : ""}
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}