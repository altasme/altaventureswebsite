import { PORTFOLIO_CONVERSION } from "../../content/site";
import { useModals } from "../../lib/modalContext";
import Section from "../ui/Section";
import CTAButton from "../ui/CTAButton";

export default function PortfolioConversion() {
  const { openContactModal } = useModals();

  return (
    <Section tone="light" className="text-center">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
          {PORTFOLIO_CONVERSION.headline}
        </h2>
        <p className="mx-auto mt-4 max-w-sm text-lg text-ink/65">{PORTFOLIO_CONVERSION.sub}</p>
        <div className="mt-8 flex justify-center">
          <CTAButton
            label={PORTFOLIO_CONVERSION.cta}
            section="portfolio-conversion"
            onClick={() => openContactModal("portfolio-conversion")}
          />
        </div>
      </div>
    </Section>
  );
}
