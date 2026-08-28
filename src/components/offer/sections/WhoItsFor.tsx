import { WHO_ITS_FOR } from "../../../content/offer";
import { track } from "../../../lib/analytics";
import OfferSection from "../ui/OfferSection";
import Eyebrow from "../ui/Eyebrow";
import OfferCTAButton from "../ui/OfferCTAButton";

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-brand-blue" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-white/30" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function WhoItsFor({ onOpenQualifier }: { onOpenQualifier: () => void }) {
  return (
    <OfferSection shade="navy">
      <Eyebrow>{WHO_ITS_FOR.eyebrow}</Eyebrow>
      <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">{WHO_ITS_FOR.headline}</h2>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-brand-blue/30 bg-brand-blue/10 p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#5fa2ff]">For you if</p>
          <ul className="mt-4 space-y-3">
            {WHO_ITS_FOR.forYou.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-white/85 sm:text-base">
                <CheckIcon />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/50">Not for you if</p>
          <ul className="mt-4 space-y-3">
            {WHO_ITS_FOR.notForYou.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-white/60 sm:text-base">
                <XIcon />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-6 text-base font-medium text-white/70">{WHO_ITS_FOR.close}</p>

      <div className="mt-6">
        <OfferCTAButton
          label={WHO_ITS_FOR.cta}
          section="who-its-for"
          onClick={() => {
            track("cta_click", { label: WHO_ITS_FOR.cta, section: "who-its-for" });
            onOpenQualifier();
          }}
        />
      </div>
    </OfferSection>
  );
}
