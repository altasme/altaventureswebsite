import { HERO_PHOTO } from "../../content/mycafepos";

// Real, operator-supplied hero photo [2026-09-30], replacing the old
// MediaPlaceholder slot for this one spot. Fills its column edge-to-edge
// (no placeholder border/dashed styling, since it's real media now) with
// a lg:-only desktop crop and a mobile crop, both WebP with a JPEG
// fallback. No scrim/overlay is needed here, unlike the homepage's
// full-bleed Hero: this page keeps its split layout, with the headline
// living in its own column on solid background rather than on top of
// the photo.
export default function HeroPhoto() {
  return (
    <div className="mcp-hero-photo">
      <picture>
        <source media="(min-width: 1024px)" srcSet={HERO_PHOTO.desktopWebp} type="image/webp" />
        <source media="(min-width: 1024px)" srcSet={HERO_PHOTO.desktopJpg} type="image/jpeg" />
        <source srcSet={HERO_PHOTO.mobileWebp} type="image/webp" />
        <img
          src={HERO_PHOTO.mobileJpg}
          alt={HERO_PHOTO.alt}
          fetchPriority="high"
          className="h-full w-full object-cover"
        />
      </picture>
    </div>
  );
}
