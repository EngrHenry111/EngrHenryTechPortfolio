"use client";
import { useState } from "react";
import site from "@/data/site.json";

const defaultLinks = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" }
];

export default function Nav({ links = defaultLinks }) {
  const [open, setOpen] = useState(false);

  return (
    <header>
      <nav className="wrap">
        <a href="#top" className="brand">
          <span className="dot" aria-hidden="true"></span>
          {site.shortName}
        </a>
        <div className={`navlinks${open ? " open" : ""}`}>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </div>
        <button
          className="navtoggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>
      </nav>
    </header>
  );
}
