import { PRIMARY_CTA } from "../../content/offer";
import { track } from "../../lib/analytics";

export default function StickyMobileOfferCTA({ onOpenQualifier }: { onOpenQualifier: () => void }) {
  const handleClick = () => {
    track("cta_click", { label: PRIMARY_CTA, section: "sticky-mobile" });
    onOpenQualifier();
  };

  return (
    <div className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-brand-navy-deep/95 backdrop-blur-md md:hidden">
      <button
        type="button"
        onClick={handleClick}
        className="flex w-full items-center justify-center gap-2 px-6 py-4 text-base font-bold uppercase tracking-wide text-white bg-brand-blue active:bg-[#094aad]"
      >
        {PRIMARY_CTA}
      </button>
    </div>
  );
}
