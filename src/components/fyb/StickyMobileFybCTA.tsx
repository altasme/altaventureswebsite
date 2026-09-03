import { STICKY_CTA } from "../../content/foryourbusiness";
import { track } from "../../lib/analytics";

export default function StickyMobileFybCTA({ onOpenContact }: { onOpenContact: () => void }) {
  const handleClick = () => {
    track("cta_click", { label: STICKY_CTA, section: "sticky-mobile" });
    onOpenContact();
  };

  return (
    <div className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-white/95 backdrop-blur-md md:hidden">
      <button
        type="button"
        onClick={handleClick}
        className="flex w-full items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-white bg-brand-blue active:bg-[#094aad]"
      >
        {STICKY_CTA}
      </button>
    </div>
  );
}
