import Image from "next/image";

export default function ProjectCard({ project }) {
  const hasLink = Boolean(project.link);
  const hasRepo = Boolean(project.repo);

  return (
    <div className="board project-card" itemScope itemType="https://schema.org/CreativeWork">
      <div className="project-thumb">
        <Image
          src={project.image || "/projects/placeholder.svg"}
          alt={`${project.name} screenshot`}
          fill
          sizes="(max-width: 700px) 100vw, 340px"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="project-body">
        <h3 itemProp="name">{project.name}</h3>
        <p className="project-role">{project.role}</p>
        <p className="project-desc" itemProp="description">{project.description}</p>
        <div className="tech-tags">
          {project.tech.map((t) => (
            <span className="tag" key={t}>{t}</span>
          ))}
        </div>
        <div className="project-links">
          {hasLink ? (
            <a href={project.link} target="_blank" rel="noopener noreferrer" itemProp="url">
              Live site
            </a>
          ) : (
            <span className="disabled">Live link coming soon</span>
          )}
          {hasRepo && (
            <a href={project.repo} target="_blank" rel="noopener noreferrer">
              Source
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
