import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "./site-origin";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_ORIGIN}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
