export default function SectionDivider() {
  return (
    <div
      className="h-10 w-full bg-brand-gradient sm:h-14"
      style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
      aria-hidden="true"
    />
  );
}
