import site from "@/data/site.json";

// Single-page site: section anchors (#projects etc.) are ignored by search
// engines, so only the homepage is listed.
export default function sitemap() {
  return [
    {
      url: site.siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    }
  ];
}
