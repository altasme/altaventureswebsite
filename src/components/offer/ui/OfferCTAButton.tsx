import type { ButtonHTMLAttributes } from "react";
import { track } from "../../../lib/analytics";

type Variant = "primary" | "secondary";

interface OfferCTAButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  label: string;
  section: string;
  onClick: () => void;
  variant?: Variant;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-brand-blue text-white hover:bg-[#0b57cc] active:bg-[#094aad] shadow-lg shadow-black/20",
  secondary: "bg-transparent text-white border-2 border-white/25 hover:border-white/50 hover:bg-white/5",
};

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function OfferCTAButton({
  label,
  section,
  onClick,
  variant = "primary",
  className = "",
  ...rest
}: OfferCTAButtonProps) {
  const handleClick = () => {
    track("cta_click", { label, section });
    onClick();
  };

  const hasArrow = label.trim().endsWith("→");
  const text = hasArrow ? label.trim().slice(0, -1).trim() : label;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-bold uppercase tracking-wide transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-offset-4 sm:text-base ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {text}
      {hasArrow && <ArrowIcon />}
    </button>
  );
}
