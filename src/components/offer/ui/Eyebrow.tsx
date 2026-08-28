export default function Eyebrow({ children }: { children: string }) {
  return (
    <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#5fa2ff]">
      <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-[2px] bg-brand-blue" aria-hidden="true" />
      {children}
    </p>
  );
}
