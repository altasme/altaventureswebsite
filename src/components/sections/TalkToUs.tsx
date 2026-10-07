import { MessageCircle } from "lucide-react";
import { TALK_TO_US } from "../../content/site";
import { useModals } from "../../lib/modalContext";
import { track } from "../../lib/analytics";
import Section from "../ui/Section";
import CTAButton from "../ui/CTAButton";

export default function TalkToUs() {
  const { openContactModal } = useModals();

  const handleClick = () => {
    track("complimentary_cta_click");
    openContactModal("talk-to-us");
  };

  return (
    <Section tone="alt">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-sm sm:p-12">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
          {TALK_TO_US.headline}
        </h2>
        <p className="mx-auto mt-4 max-w-sm text-base text-ink/65">{TALK_TO_US.support}</p>
        <div className="mt-8 flex justify-center">
          <CTAButton label={TALK_TO_US.cta} section="talk-to-us" onClick={handleClick} />
        </div>
      </div>
    </Section>
  );
}
