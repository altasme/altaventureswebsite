import { WHY_ALTAVENTURES } from "../../content/site";
import Section from "../ui/Section";

export default function WhyAltaventures() {
  return (
    <Section tone="dark">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
        {WHY_ALTAVENTURES.headline}
      </h2>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {WHY_ALTAVENTURES.points.map((point, i) => (
          <div key={point.title} className="flex gap-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold">
              {i + 1}
            </span>
            <div>
              <h3 className="text-lg font-semibold">{point.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/60">{point.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
