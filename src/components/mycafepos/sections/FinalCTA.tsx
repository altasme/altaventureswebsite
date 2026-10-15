import { FINAL_CTA } from "../../../content/mycafepos";
import AccessButton from "../AccessButton";

export default function FinalCTA() {
  return (
    <section className="py-20" style={{ background: "var(--mcp-primary)", color: "var(--mcp-primary-foreground)" }}>
      <div className="mcp-container text-center">
        <h2 className="mx-auto max-w-3xl" style={{ color: "var(--mcp-primary-foreground)" }}>
          {FINAL_CTA.headline}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg" style={{ color: "color-mix(in oklch, var(--mcp-primary-foreground) 75%, transparent)" }}>
          {FINAL_CTA.copy}
        </p>
        <div className="mt-8 flex justify-center">
          <AccessButton label={FINAL_CTA.cta} location="final" variant="secondary" />
        </div>
        <p className="mt-4 text-xs" style={{ color: "color-mix(in oklch, var(--mcp-primary-foreground) 65%, transparent)" }}>
          {FINAL_CTA.trustLine}
        </p>
      </div>
    </section>
  );
}
