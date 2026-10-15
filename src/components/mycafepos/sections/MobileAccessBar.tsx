import { MOBILE_ACCESS_BAR } from "../../../content/mycafepos";
import AccessButton from "../AccessButton";

export default function MobileAccessBar() {
  return (
    <div className="mcp-mobile-access-bar">
      <div>
        <strong>{MOBILE_ACCESS_BAR.label}</strong>
        <span>{MOBILE_ACCESS_BAR.sublabel}</span>
      </div>
      <AccessButton label={MOBILE_ACCESS_BAR.cta} location="mobile_sticky" className="mcp-btn--sm" />
    </div>
  );
}
