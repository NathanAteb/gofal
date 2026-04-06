import Image from "next/image";
import { searchUnsplash, getOptimizedUrl } from "@/lib/utils/unsplash";

interface UnsplashImageProps {
  query: string;
  alt_cy: string;
  alt_en: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
}

// Static fallback images (used when no Unsplash key or API fails)
const FALLBACK_IMAGES: Record<string, string> = {
  "wales landscape": "https://images.unsplash.com/photo-1573155993874-d5d48af862ba?w=1200&q=80&fm=webp&fit=crop",
  "care home": "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&q=80&fm=webp&fit=crop",
  "elderly care": "https://images.unsplash.com/photo-1516307365426-bea591f05011?w=800&q=80&fm=webp&fit=crop",
  "community": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80&fm=webp&fit=crop",
  "welsh countryside": "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1200&q=80&fm=webp&fit=crop",
  "nursing": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80&fm=webp&fit=crop",
  "family care": "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80&fm=webp&fit=crop",
};

function getFallbackUrl(query: string): string {
  const lower = query.toLowerCase();
  for (const [key, url] of Object.entries(FALLBACK_IMAGES)) {
    if (lower.includes(key)) return url;
  }
  return FALLBACK_IMAGES["wales landscape"];
}

export async function UnsplashImage({
  query,
  alt_cy,
  alt_en,
  width = 800,
  height = 450,
  className = "",
  priority = false,
  fill = false,
}: UnsplashImageProps) {
  let src: string;
  let photographer: string | null = null;
  let profileUrl: string | null = null;

  const photos = await searchUnsplash(query, 1);

  if (photos.length > 0) {
    src = getOptimizedUrl(photos[0], width);
    photographer = photos[0].user.name;
    profileUrl = photos[0].user.links.html;
  } else {
    src = getFallbackUrl(query);
  }

  const alt = `${alt_cy} / ${alt_en}`;

  return (
    <figure className="relative">
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover ${className}`}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`object-cover ${className}`}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
        />
      )}
      {photographer && profileUrl && (
        <figcaption className="absolute bottom-0 right-0 bg-black/50 px-2 py-1 text-[10px] text-white/80 rounded-tl-lg">
          Photo by{" "}
          <a
            href={`${profileUrl}?utm_source=gofal_wales&utm_medium=referral`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {photographer}
          </a>{" "}
          on{" "}
          <a
            href="https://unsplash.com/?utm_source=gofal_wales&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Unsplash
          </a>
        </figcaption>
      )}
    </figure>
  );
}

// Client-side version for fallback images (no API call)
export function StaticImage({
  src,
  alt_cy,
  alt_en,
  width = 800,
  height = 450,
  className = "",
  priority = false,
  fill = false,
  photographer,
  profileUrl,
}: {
  src: string;
  alt_cy: string;
  alt_en: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  photographer?: string;
  profileUrl?: string;
}) {
  const alt = `${alt_cy} / ${alt_en}`;

  return (
    <figure className="relative">
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover ${className}`}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`object-cover ${className}`}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
        />
      )}
      {photographer && profileUrl && (
        <figcaption className="absolute bottom-0 right-0 bg-black/50 px-2 py-1 text-[10px] text-white/80 rounded-tl-lg">
          Photo by{" "}
          <a href={`${profileUrl}?utm_source=gofal_wales&utm_medium=referral`} target="_blank" rel="noopener noreferrer" className="underline">
            {photographer}
          </a>{" "}
          on{" "}
          <a href="https://unsplash.com/?utm_source=gofal_wales&utm_medium=referral" target="_blank" rel="noopener noreferrer" className="underline">
            Unsplash
          </a>
        </figcaption>
      )}
    </figure>
  );
}
