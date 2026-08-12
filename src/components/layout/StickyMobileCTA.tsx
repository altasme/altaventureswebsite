import { useModals } from "../../lib/modalContext";
import { track } from "../../lib/analytics";

export default function StickyMobileCTA() {
  const { openContactModal } = useModals();

  const handleClick = () => {
    track("cta_click", { label: "Let's Talk", section: "sticky-mobile" });
    openContactModal("sticky-mobile");
  };

  return (
    <div className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-white/95 backdrop-blur-md md:hidden">
      <button
        type="button"
        onClick={handleClick}
        className="flex w-full items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-white bg-brand-blue active:bg-[#094aad]"
      >
        Let's Talk
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 4h16v12H7l-3 3V4Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
