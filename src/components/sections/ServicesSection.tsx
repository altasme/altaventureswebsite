import { SERVICES } from "../../content/site";
import { PORTFOLIO_BY_ID } from "../../content/portfolio";
import { useModals } from "../../lib/modalContext";
import { track } from "../../lib/analytics";
import Section from "../ui/Section";
import CTAButton from "../ui/CTAButton";
import Tag from "../ui/Tag";

export default function ServicesSection() {
  const { openContactModal } = useModals();

  return (
    <Section id="services" tone="light">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        {SERVICES.headline}
      </h2>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {SERVICES.items.map((service, i) => {
          // An odd item count leaves the last card alone in the grid, so it
          // spans full width and lays its bullets out in two columns, reading
          // as a deliberate closing card rather than an orphaned leftover.
          const isFeatured = i === SERVICES.items.length - 1 && SERVICES.items.length % 2 === 1;

          return (
            <div
              key={service.id}
              onMouseEnter={() => track("service_interaction", { service: service.id })}
              className={`flex flex-col rounded-2xl border border-ink/8 p-7 ${isFeatured ? "lg:col-span-2" : ""}`}
            >
              <p className="text-xs font-semibold tracking-wide text-brand-blue">
                {service.name}
              </p>
              <h3 className="mt-2 text-xl font-bold text-ink">{service.outcome}</h3>

              <ul
                className={`mt-4 flex-1 gap-x-8 gap-y-2 ${isFeatured ? "lg:grid lg:grid-cols-2 space-y-2 lg:space-y-0" : "space-y-2"}`}
              >
                {service.capabilities.map((capability) => (
                  <li key={capability} className="flex gap-2 text-sm text-ink/65">
                    <span className="mt-0.5 text-brand-blue">•</span>
                    {capability}
                  </li>
                ))}
              </ul>

              {service.referenceIds.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {service.referenceIds.map((id) => (
                    <Tag key={id}>{PORTFOLIO_BY_ID[id].name}</Tag>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <CTAButton
                  label={service.cta}
                  section={`services-${service.id}`}
                  onClick={() => openContactModal(`services-${service.id}`)}
                  variant="secondary"
                />
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
