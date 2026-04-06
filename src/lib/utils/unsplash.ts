const UNSPLASH_BASE = "https://api.unsplash.com";

interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  user: {
    name: string;
    links: {
      html: string;
    };
  };
}

export async function searchUnsplash(
  query: string,
  perPage = 3
): Promise<UnsplashPhoto[]> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return [];

  try {
    const res = await fetch(
      `${UNSPLASH_BASE}/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`,
      {
        headers: { Authorization: `Client-ID ${key}` },
        next: { revalidate: 86400 }, // 24hr cache
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch {
    return [];
  }
}

export function getUnsplashAttribution(photo: UnsplashPhoto): {
  photographer: string;
  profileUrl: string;
} {
  return {
    photographer: photo.user.name,
    profileUrl: photo.user.links.html,
  };
}

export function getOptimizedUrl(photo: UnsplashPhoto, width = 800): string {
  return `${photo.urls.raw}&w=${width}&q=80&fm=webp&fit=crop`;
}
