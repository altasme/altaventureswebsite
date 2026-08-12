import { COMPLIMENTARY_OFFER } from "../../content/site";
import { useModals } from "../../lib/modalContext";
import { track } from "../../lib/analytics";
import Section from "../ui/Section";
import CTAButton from "../ui/CTAButton";

export default function ComplimentaryOffer() {
  const { openContactModal } = useModals();

  const handleClick = () => {
    track("complimentary_cta_click");
    openContactModal("complimentary-offer");
  };

  return (
    <Section tone="alt">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-sm sm:p-12">
        <h2 className="text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
          {COMPLIMENTARY_OFFER.headline}
        </h2>
        <p className="mt-4 text-xl font-semibold text-brand-blue">
          {COMPLIMENTARY_OFFER.offerLine}
        </p>
        <p className="mx-auto mt-4 max-w-sm text-base text-ink/65">
          {COMPLIMENTARY_OFFER.support}
        </p>
        <div className="mt-8 flex justify-center">
          <CTAButton
            label={COMPLIMENTARY_OFFER.cta}
            section="complimentary-offer"
            onClick={handleClick}
          />
        </div>
      </div>
    </Section>
  );
}
