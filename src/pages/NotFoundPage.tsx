import { useEffect } from "react";
import { Link } from "react-router-dom";
import { BRAND } from "../content/site";

/** Catch-all for unknown URLs. Prerendered to /404.html and served with a real 404 status. */
export default function NotFoundPage() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `Page not found | ${BRAND.name}`;
    const meta = document.querySelector('meta[name="robots"]') ?? document.createElement("meta");
    meta.setAttribute("name", "robots");
    meta.setAttribute("content", "noindex, nofollow");
    if (!meta.parentNode) document.head.appendChild(meta);
    return () => {
      document.title = previousTitle;
      meta.parentNode?.removeChild(meta);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-blue">404</p>
      <h1 className="mt-3 text-3xl font-extrabold text-brand-navy sm:text-4xl">Page not found</h1>
      <p className="mt-4 max-w-md text-ink/70">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-xl bg-brand-blue px-6 py-3 text-sm font-semibold text-white"
      >
        Back to {BRAND.name}
      </Link>
    </main>
  );
}
