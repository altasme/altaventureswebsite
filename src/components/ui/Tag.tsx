interface TagProps {
  children: string;
  tone?: "light" | "dark";
}

export default function Tag({ children, tone = "light" }: TagProps) {
  const toneClasses =
    tone === "dark"
      ? "bg-white/10 text-white border-white/15"
      : "bg-brand-blue/8 text-brand-navy border-brand-blue/15";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${toneClasses}`}
    >
      {children}
    </span>
  );
}
