import Image from "next/image";
import Nav from "@/components/Nav";
import HeroSignature from "@/components/HeroSignature";
import ProjectCard from "@/components/ProjectCard";
import site from "@/data/site.json";
import eduData from "@/data/education.json";
import { connectDB } from "@/lib/mongodb";
import ProfileModel from "@/models/Profile";
import SkillModel from "@/models/Skill";
import ExperienceModel from "@/models/Experience";
import ProjectModel from "@/models/Project";
import AchievementModel from "@/models/Achievement";
import { LEADERSHIP } from "@/lib/admin-collections";

export default async function Home() {
  await connectDB();

  const [profileDoc, skillDocs, experienceDocs, projectDocs, achievementDocs] = await Promise.all([
    ProfileModel.findOne().lean(),
    SkillModel.find().sort({ _id: 1 }).lean(),
    ExperienceModel.find().sort({ sortOrder: 1, _id: 1 }).lean(),
    ProjectModel.find().sort({ sortOrder: 1, _id: 1 }).lean(),
    AchievementModel.find().sort({ sortOrder: 1, _id: 1 }).lean()
  ]);

  const profile = {
    ...profileDoc,
    quickFacts: profileDoc?.quickFacts || [],
    roleParts: (profileDoc?.roleLine || "").split("/").map((s) => s.trim()).filter(Boolean),
    about: (profileDoc?.about || "").split(/\n\s*\n/).filter(Boolean)
  };

  // Skills are stored as one document per skill; re-group them by category
  // to feed the same skill-groups UI the JSON version used.
  const skills = [];
  const groupIndexByCategory = new Map();
  for (const s of skillDocs) {
    if (!groupIndexByCategory.has(s.category)) {
      groupIndexByCategory.set(s.category, skills.length);
      skills.push({ group: s.category, items: [] });
    }
    skills[groupIndexByCategory.get(s.category)].items.push(s.name);
  }

  const allExperience = experienceDocs.map((e) => ({ ...e, id: e._id.toString(), desc: e.description }));
  const experience = allExperience.filter((e) => e.category !== LEADERSHIP);
  const leadership = allExperience.filter((e) => e.category === LEADERSHIP);
  const projects = projectDocs.map((p) => ({ ...p, id: p._id.toString(), tech: p.tech || [] }));
  const achievements = achievementDocs.map((a) => ({ ...a, id: a._id.toString() }));

  // Leadership and Achievements sections only appear once they have content.
  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#experience", label: "Experience" },
    leadership.length > 0 && { href: "#leadership", label: "Leadership" },
    { href: "#projects", label: "Projects" },
    achievements.length > 0 && { href: "#achievements", label: "Achievements" },
    { href: "#education", label: "Education" },
    { href: "#contact", label: "Contact" }
  ].filter(Boolean);

  return (
    <>
      <div className="trunk" aria-hidden="true"></div>
      <Nav links={navLinks} />

      <section id="top" className="hero wrap">
        <div className="hero-grid">
          <div>
            <p className="hero-role">
              {profile.roleParts.map((part, i) => (
                <span key={part}>
                  {i > 0 && <>{" "}<span className="sep">/</span>{" "}</>}
                  {part}
                </span>
              ))}
            </p>
            <h1 className="name" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
              {site.name}
            </h1>
            <HeroSignature />
            <p className="lede">{profile.lede}</p>
            <div className="cta-row">
              <a href="#projects" className="btn btn-primary">View my work</a>
              <a href="#contact" className="btn btn-ghost">Get in touch</a>
            </div>
          </div>
          <div className="scope">
            <div className="scope-header">
              <div className="scope-dots"><i></i><i></i><i></i></div>
              <span>status.log</span>
            </div>
            <div className="quick-facts">
              {profile.quickFacts.map((f) => (
                <div className="fact" key={f.k}>
                  <div className="k">{f.k}</div>
                  <div className="v">{f.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="wrap">
        <p className="eyebrow">About</p>
        <h2 className="section-title">Where circuits meet code</h2>
        <div className="about-grid">
          <div>
            {profile.about.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="board" style={{ display: "flex", gap: 16, flexDirection: "column", alignItems: "flex-start" }}>
            <div className="avatar-ring">
              <Image src={profile.photo} alt={site.name} width={44} height={44} style={{ objectFit: "cover" }} />
            </div>
            <div className="quick-facts" style={{ width: "100%" }}>
              <div className="fact"><div className="k">Location</div><div className="v">{site.location.addressLocality}, {site.location.addressRegion}, Nigeria</div></div>
              <div className="fact"><div className="k">Phone</div><div className="v">{site.phone}</div></div>
              <div className="fact"><div className="k">Email</div><div className="v">{site.email}</div></div>
              <div className="fact"><div className="k">LinkedIn</div><div className="v">{site.social.linkedin.replace("https://", "")}</div></div>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="wrap">
        <p className="eyebrow">Skills</p>
        <h2 className="section-title">Technical toolkit</h2>
        <p className="section-sub">Spanning full-stack development, applied AI, DevOps, and electrical engineering.</p>
        <div className="skill-groups">
          {skills.map((group) => (
            <div className="skill-group board" key={group.group}>
              <h3>{group.group}</h3>
              <div className="chips">
                {group.items.map((item) => (
                  <span className="chip" key={item}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="experience" className="wrap">
        <p className="eyebrow">Experience</p>
        <h2 className="section-title">Professional path</h2>
        <div className="timeline">
          {experience.map((e) => (
            <div className="tl-item" key={e.id}>
              <p className="tl-role">{e.role}</p>
              <p className="tl-org">{e.org}</p>
              <p className="tl-date">{e.date}</p>
              <p className="tl-desc">{e.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {leadership.length > 0 && (
        <section id="leadership" className="wrap">
          <p className="eyebrow">Leadership</p>
          <h2 className="section-title">Leadership &amp; public service</h2>
          <div className="timeline">
            {leadership.map((e) => (
              <div className="tl-item" key={e.id}>
                <p className="tl-role">{e.role}</p>
                <p className="tl-org">{e.org}</p>
                <p className="tl-date">{e.date}</p>
                <p className="tl-desc">{e.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="projects" className="wrap">
        <p className="eyebrow">Projects</p>
        <h2 className="section-title">Selected technology projects</h2>
        <p className="section-sub">
          Platforms and products I&apos;ve designed, built, and shipped — from AI automation to civic technology.
        </p>
        <div className="project-grid">
          {projects.map((p) => (
            <ProjectCard project={p} key={p.id} />
          ))}
        </div>
      </section>

      {achievements.length > 0 && (
        <section id="achievements" className="wrap">
          <p className="eyebrow">Achievements</p>
          <h2 className="section-title">Awards &amp; recognition</h2>
          <div className="project-grid">
            {achievements.map((a) => (
              <div className="board project-card" key={a.id}>
                {a.image && (
                  <div className="project-thumb">
                    <Image src={a.image} alt={a.title} fill sizes="(max-width: 700px) 100vw, 340px" style={{ objectFit: "cover" }} />
                  </div>
                )}
                <div className="project-body">
                  <h3>{a.title}</h3>
                  {(a.issuer || a.date) && (
                    <p className="project-role">{[a.issuer, a.date].filter(Boolean).join(" · ")}</p>
                  )}
                  {a.description && <p className="project-desc">{a.description}</p>}
                  {a.link && (
                    <div className="project-links">
                      <a href={a.link} target="_blank" rel="noopener noreferrer">View</a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="education" className="wrap">
        <p className="eyebrow">Education & certifications</p>
        <h2 className="section-title">Learning path</h2>
        <div className="edu-grid">
          <div>
            {eduData.education.map((e) => (
              <div className="edu-item" key={e.t}>
                <div className="t">{e.t}</div>
                <div className="s">{e.s}</div>
                <div className="d">{e.d}</div>
              </div>
            ))}
          </div>
          <div>
            {eduData.certifications.map((e) => (
              <div className="edu-item" key={e.t}>
                <div className="t">{e.t}</div>
                <div className="s">{e.s}</div>
                <div className="d">{e.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="wrap">
        <p className="eyebrow">Contact</p>
        <h2 className="section-title">Let&apos;s build something</h2>
        <p className="section-sub">Open to full-stack, AI integration, and electrical engineering contract work.</p>
        <div className="contact-grid">
          <div className="board contact-item">
            <div className="icon"><svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z"/><path d="m4 6 8 7 8-7"/></svg></div>
            <div><div className="lbl">Email</div><a className="val" href={`mailto:${site.email}`}>{site.email}</a></div>
          </div>
          <div className="board contact-item">
            <div className="icon"><svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7 12.4 12.4 0 0 0 .7 2.8 2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4 12.4 12.4 0 0 0 2.8.7 2 2 0 0 1 1.7 2Z"/></svg></div>
            <div><div className="lbl">Phone</div><a className="val" href={`tel:${site.phone}`}>{site.phone}</a></div>
          </div>
          <div className="board contact-item">
            <div className="icon"><svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></div>
            <div><div className="lbl">LinkedIn</div><a className="val" href={site.social.linkedin} target="_blank" rel="noopener noreferrer">{site.social.linkedin.replace("https://", "")}</a></div>
          </div>
          <div className="board contact-item">
            <div className="icon"><svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>
            <div><div className="lbl">Location</div><div className="val">{site.location.addressLocality}, {site.location.addressRegion}, Nigeria</div></div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">{site.name} · <span>Engineering circuits and code</span></div>
      </footer>
    </>
  );
}
