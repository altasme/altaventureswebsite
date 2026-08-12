import type { ButtonHTMLAttributes, ReactNode } from "react";
import { track } from "../../lib/analytics";

type Variant = "primary" | "secondary" | "ghost";

interface CTAButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  label: string;
  section: string;
  onClick: () => void;
  variant?: Variant;
  icon?: ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-brand-blue text-white hover:bg-[#0b57cc] active:bg-[#094aad] shadow-lg shadow-black/15",
  secondary:
    "bg-white text-brand-navy border border-brand-navy/15 hover:border-brand-navy/30 hover:bg-paper-alt",
  ghost: "bg-transparent text-white border border-white/30 hover:bg-white/10",
};

export default function CTAButton({
  label,
  section,
  onClick,
  variant = "primary",
  icon,
  className = "",
  ...rest
}: CTAButtonProps) {
  const handleClick = () => {
    track("cta_click", { label, section });
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold tracking-tight transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-offset-4 sm:text-base ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {label}
      {icon}
    </button>
  );
}
