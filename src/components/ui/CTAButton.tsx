import type { ButtonHTMLAttributes, ReactNode } from "react";
import { track } from "../../lib/analytics";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

interface CTAButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  label: string;
  section: string;
  onClick: () => void;
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  // [2026-10-25] Added a richer, brand-tinted hover shadow on top of the
  // existing resting shadow-lg -- a soft, colored glow under the button
  // reads as more "expensive" than a flat neutral shadow, a common
  // premium-SaaS button treatment.
  primary:
    "bg-brand-blue text-white hover:bg-[#0b57cc] active:bg-[#094aad] shadow-lg shadow-black/15 hover:shadow-[0_14px_32px_-10px_rgba(13,104,239,0.55)]",
  secondary:
    "bg-white text-brand-navy border border-brand-navy/15 hover:border-brand-navy/30 hover:bg-paper-alt hover:shadow-[0_10px_26px_-12px_rgba(2,37,111,0.3)]",
  ghost: "bg-transparent text-white border border-white/30 hover:bg-white/10",
};

const SIZE_CLASSES: Record<Size, string> = {
  md: "px-6 py-3.5 text-sm sm:text-base",
  lg: "px-7 py-4 text-base sm:text-lg",
};

export default function CTAButton({
  label,
  section,
  onClick,
  variant = "primary",
  size = "md",
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
      // [2026-10-25] group + overflow-hidden host a shine-sweep overlay
      // (the <span> below) -- a diagonal light band that sweeps across on
      // hover, a common premium-button micro-interaction. active:scale
      // gives a tactile "press" on click/tap that the old version lacked.
      // Both run on the same expo-out easing Reveal.tsx now uses, so
      // motion across the page reads as one consistent, deliberate system
      // rather than several different defaults.
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold tracking-tight transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus-visible:outline-offset-4 ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[120%] motion-reduce:hidden"
      />
      <span className="relative z-10 inline-flex items-center gap-2">
        {label}
        {icon}
      </span>
    </button>
  );
}
