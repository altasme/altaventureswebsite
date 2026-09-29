export default function SectionTitle({
  eyebrow,
  title,
  copy,
  center = false,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="mcp-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {copy && <p className="mcp-muted mt-5 text-lg leading-8">{copy}</p>}
    </div>
  );
}
