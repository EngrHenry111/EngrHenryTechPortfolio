import Image from "next/image";
import Nav from "@/components/Nav";
import HeroSignature from "@/components/HeroSignature";
import ProjectCard from "@/components/ProjectCard";
import site from "@/data/site.json";
import profile from "@/data/profile.json";
import skills from "@/data/skills.json";
import experience from "@/data/experience.json";
import projects from "@/data/projects.json";
import eduData from "@/data/education.json";

export default function Home() {
  return (
    <>
      <div className="trunk" aria-hidden="true"></div>
      <Nav />

      <section id="top" className="hero wrap">
        <div className="hero-grid">
          <div>
            <p className="hero-role">
              Electrical Engineer <span className="sep">/</span> Full-Stack Developer{" "}
              <span className="sep">/</span> AI Engineering Student
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
            <div className="tl-item" key={e.role + e.date}>
              <p className="tl-role">{e.role}</p>
              <p className="tl-org">{e.org}</p>
              <p className="tl-date">{e.date}</p>
              <p className="tl-desc">{e.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="projects" className="wrap">
        <p className="eyebrow">Projects</p>
        <h2 className="section-title">Selected technology projects</h2>
        <p className="section-sub">
          To add a new project: open <code>data/projects.json</code>, add an entry with a name, description,
          image path (drop the file in <code>public/projects/</code>), live link, and tech stack.
        </p>
        <div className="project-grid">
          {projects.map((p) => (
            <ProjectCard project={p} key={p.id} />
          ))}
        </div>
      </section>

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
