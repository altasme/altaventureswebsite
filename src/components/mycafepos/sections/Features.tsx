import { BarChart3, PackageCheck, ReceiptText, ShoppingBag } from "lucide-react";
import { FEATURES } from "../../../content/mycafepos";
import { track } from "../../../lib/analytics";
import SectionTitle from "../SectionTitle";
import MediaPlaceholder from "../MediaPlaceholder";

const ICONS = [ShoppingBag, ReceiptText, PackageCheck, BarChart3];
const SCREENSHOT_MEDIA = [
  { width: 1200, height: 800, ratio: "3:2", type: "WebP" },
  { width: 1200, height: 800, ratio: "3:2", type: "WebP" },
];

export default function Features() {
  return (
    <section id="features" className="mcp-section" onMouseEnter={() => track("mycafe_feature_section_view", {})}>
      <div className="mcp-container">
        <SectionTitle center eyebrow={FEATURES.eyebrow} title={FEATURES.headline} copy={FEATURES.copy} />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {FEATURES.items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <article className="mcp-feature-card" key={item.title}>
                <div className="flex items-start justify-between gap-5">
                  <span className="mcp-feature-icon">
                    <Icon />
                  </span>
                  <span className="mcp-status-current">Available</span>
                </div>
                <h3 className="mt-8">{item.title}</h3>
                <p>{item.copy}</p>
                {"screenshotTitle" in item && item.screenshotTitle && (
                  <div className="mt-6">
                    <MediaPlaceholder
                      {...SCREENSHOT_MEDIA[i]}
                      title={item.screenshotTitle}
                      note="Replace with a verified in-product screen"
                    />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
