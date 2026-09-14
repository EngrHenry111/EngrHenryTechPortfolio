# Henry Mfon Akpan — Portfolio (Next.js)

This is the design + structure stage: a real Next.js app with server-rendered pages
(fixes SEO — Google sees actual content instead of an empty div), structured data
for search engines, a sitemap/robots.txt, and content organized as data files ready
to move into a database.

## Current status

- ✅ Full site built and build-tested (design, all sections, SEO metadata)
- ✅ `lib/mongodb.js` — Mongoose connection helper, ready to use
- ⬜ Content still lives in `/data/*.json` — not yet moved to MongoDB
- ⬜ `mongoose` is not yet installed (`lib/mongodb.js` needs it — run
  `npm install mongoose` before it will work)
- ⬜ No admin dashboard yet

## What to do before handing this to Claude Code in VS Code

1. Copy `.env.local.example` to `.env.local`
2. Fill in your real `MONGODB_URI` (MongoDB Atlas connection string)
3. Push this folder to a GitHub repo
4. In VS Code, open the repo and run the "Stage 3" prompt (migrate JSON → MongoDB)
   provided in chat

## Run it locally (as-is, still reading from JSON)

```
npm install
npm run dev
```

Open http://localhost:3000

## Deploy

Push this folder to a GitHub repo, then import it in Vercel (vercel.com/new). No config
needed — Vercel auto-detects Next.js.

Before deploying, update `data/site.json` → `siteUrl` to your real domain once you have one
(this powers the sitemap, canonical URL, and Open Graph tags).

## How to add a new project (name, link, image)

Open `data/projects.json` and add an entry:

```json
{
  "id": "unique-id",
  "name": "Project name",
  "role": "Your role",
  "description": "One or two sentences about it.",
  "image": "/projects/your-screenshot.png",
  "link": "https://the-live-site.com",
  "repo": "https://github.com/you/repo",
  "tech": ["React", "Node.js"],
  "featured": true
}
```

Drop the screenshot file into `public/projects/`. If you leave `image` pointing at
`/projects/placeholder.svg`, a clean placeholder graphic shows instead — no broken images.
If you leave `link` empty, the card shows "Live link coming soon" instead of a dead link.

## How to update your profile, skills, experience, education

All in the `data/` folder as plain JSON — no code changes needed:
- `data/profile.json` — bio, tagline, quick facts
- `data/skills.json` — skill groups
- `data/experience.json` — work timeline
- `data/education.json` — education & certifications
- `data/site.json` — SEO metadata, contact info, social links

## What's next (Stage 3+)

Right now content lives in JSON files, which you edit and redeploy. The next stage moves
this into a Postgres database (via Prisma, hosted on Render) with a login-protected
`/admin` page, so you can add projects/achievements/goals through a form instead of
editing files.

## SEO checklist already in place

- Server-rendered HTML (fixes the old SPA's empty-div problem)
- Unique title/description per page via `metadata` API
- Open Graph + Twitter card tags
- JSON-LD `Person` schema (helps Google understand who you are)
- Auto-generated `sitemap.xml` and `robots.txt`
- Semantic heading hierarchy (one h1, proper h2/h3)

## Still to do before launch

- Buy/point a real domain, update `siteUrl` in `data/site.json`
- Add real project screenshots to `public/projects/`
- Fill in `link` for each project once live
- Submit the sitemap to Google Search Console and Bing Webmaster Tools
- Add your GitHub URL if you want it in the Person schema (`data/site.json` → `social.github`)
