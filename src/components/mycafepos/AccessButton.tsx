import { ArrowRight } from "lucide-react";
import { ACCESS_LINK } from "../../content/mycafepos";
import { track } from "../../lib/analytics";

// Every "Get Free Access" CTA on this page resolves to the same on-page
// offer section, per the source handover doc's own instruction: no real
// signup destination was supplied, so nothing was invented. Fires
// mycafe_hero_cta_click for the hero's primary CTA specifically (it's
// the page's main conversion moment) and mycafe_free_access_click
// everywhere else, carrying which CTA location was clicked.
export default function AccessButton({
  label = "Get Free Access",
  location,
  variant = "primary",
  className = "",
}: {
  label?: string;
  location: string;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const handleClick = () => {
    if (location === "hero") {
      track("mycafe_hero_cta_click", {});
    } else {
      track("mycafe_free_access_click", { location });
    }
  };

  return (
    <a
      href={ACCESS_LINK}
      onClick={handleClick}
      className={`mcp-btn ${variant === "secondary" ? "mcp-btn--secondary" : ""} ${className}`}
    >
      {label}
      <ArrowRight size={18} aria-hidden="true" />
    </a>
  );
}
