import site from "@/data/site.json";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
      disallow: "/admin"
    },
    sitemap: `${site.siteUrl}/sitemap.xml`
  };
}
