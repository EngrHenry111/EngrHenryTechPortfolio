import "./globals.css";
import site from "@/data/site.json";
import profile from "@/data/profile.json";

export const metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: site.defaultTitle,
    template: site.titleTemplate
  },
  description: site.description,
  keywords: site.keywords,
  authors: [{ name: site.name, url: site.siteUrl }],
  creator: site.name,
  alternates: {
    canonical: site.siteUrl
  },
  openGraph: {
    type: "website",
    url: site.siteUrl,
    title: site.defaultTitle,
    description: site.description,
    siteName: site.name,
    images: [
      {
        url: profile.photo,
        width: 500,
        height: 500,
        alt: site.name
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    creator: site.twitterHandle || undefined,
    title: site.defaultTitle,
    description: site.description,
    images: [profile.photo]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large"
    }
  },
  icons: {
    icon: "/favicon.svg"
  },
  verification: {
    google: ""
  }
};

export default function RootLayout({ children }) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    alternateName: site.shortName,
    jobTitle: site.role,
    url: site.siteUrl,
    image: `${site.siteUrl}${profile.photo}`,
    email: `mailto:${site.email}`,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location.addressLocality,
      addressRegion: site.location.addressRegion,
      addressCountry: site.location.addressCountry
    },
    sameAs: [
      site.social.linkedin,
      site.social.facebook,
      site.social.instagram,
      site.social.twitter,
      site.social.tiktok,
      site.social.youtube,
      site.social.github
    ].filter(Boolean),
    knowsAbout: [
      "Full-Stack Web Development",
      "React",
      "Node.js",
      "Artificial Intelligence",
      "Electrical Engineering"
    ]
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
