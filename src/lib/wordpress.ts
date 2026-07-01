import type { HomePageAcf, WpMedia, WpPage, SiteOptions } from "@/types/wordpress";

const WORDPRESS_API = process.env.WORDPRESS_API;
 
type FetchPageBySlugOptions = {
  slug: string;
  revalidate?: number;
};

type FetchMediaByIdOptions = {
  revalidate?: number;
};

export async function fetchPageBySlug<TAcf = Record<string, unknown>>({
  slug,
  revalidate = 300,
}: FetchPageBySlugOptions): Promise<WpPage<TAcf> | null> {
  if (!WORDPRESS_API) {
    throw new Error("WORDPRESS_API is not configured");
  }

  const params = new URLSearchParams({
    slug,
    _fields: "id,slug,title,content,excerpt,acf",
  });

  const response = await fetch(`${WORDPRESS_API}/wp/v2/pages?${params}`, {
    next: {
      revalidate,
    }, 
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch WordPress page "${slug}"`);
  }

  const pages = (await response.json()) as WpPage<TAcf>[];

  return pages[0] ?? null;
}

export function getHomePage() {
  return fetchPageBySlug<HomePageAcf>({
    slug: "home",
    revalidate: 300,
  });
}

export async function fetchMediaById(
  id: number | null | undefined,
  { revalidate = 300 }: FetchMediaByIdOptions = {},
): Promise<WpMedia | null> {
  if (!id) {
    return null;
  }

  if (!WORDPRESS_API) {
    throw new Error("WORDPRESS_API is not configured");
  }

  const params = new URLSearchParams({
    _fields: "id,source_url,alt_text,title,media_details",
  });

  const response = await fetch(`${WORDPRESS_API}/wp/v2/media/${id}?${params}`, {
    next: {
      revalidate,
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch WordPress media "${id}"`);
  }

  return (await response.json()) as WpMedia;
}


type FetchOptionsOptions = {
  revalidate?: number;
};

export async function fetchOptions<TOptions>({
  revalidate = 300,
}: FetchOptionsOptions = {}): Promise<TOptions | null> {
  if (!WORDPRESS_API) {
    throw new Error("WORDPRESS_API is not configured");
  }

  const response = await fetch(`${WORDPRESS_API}/options/all`, {
    next: {
      revalidate,
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch WordPress options");
  }

  return (await response.json()) as TOptions;
}

export function getSiteOptions() {
  return fetchOptions<SiteOptions>({
    revalidate: 300,
  });
}