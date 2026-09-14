import site from "@/data/site.json";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: `${site.siteUrl}/sitemap.xml`
  };
}
