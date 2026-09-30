export default function SectionTitle({
  title,
  copy,
  center = false,
}: {
  title: string;
  copy?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <h2>{title}</h2>
      {copy && <p className="mcp-muted mt-5 text-lg leading-8">{copy}</p>}
    </div>
  );
}
