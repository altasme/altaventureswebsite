import { MonitorSmartphone } from "lucide-react";

// No product media exists yet for MyCafe POS (no images were generated
// or supplied, per the site-wide real-work-only guardrail, CLAUDE.md
// §16) — every visual slot on this page is a labeled placeholder stating
// exactly what asset belongs there (canvas, aspect ratio, file type,
// required subject matter) so it can be swapped for verified product
// media later without guessing dimensions. See content/mycafepos.ts's
// MEDIA export and CLAUDE.md's media replacement table.
export default function MediaPlaceholder({
  width,
  height,
  ratio,
  type,
  title,
  note,
  className = "",
}: {
  width: number;
  height: number;
  ratio: string;
  type: string;
  title: string;
  note: string;
  className?: string;
}) {
  return (
    <div
      className={`mcp-media-placeholder ${className}`}
      role="img"
      aria-label={`${title} placeholder, ${width} by ${height} pixels`}
    >
      <div className="mcp-media-placeholder__inner">
        <MonitorSmartphone aria-hidden="true" />
        <p className="mcp-mp-title">{title}</p>
        <p className="mcp-mp-dims">
          {width} × {height} px · {ratio} · {type}
        </p>
        <span className="mcp-mp-note">{note}</span>
      </div>
    </div>
  );
}
