// Describes every editable collection for the admin dashboard: which fields
// each form shows and how list pages are labelled. Field types:
// text, textarea, url, image, tags (comma-separated), checkbox, number,
// select, date, pairs (one "Key: Value" per line).

export const LEADERSHIP = "Leadership & Public Service";

export const collections = {
  projects: {
    label: "Projects",
    singular: "Project",
    titleField: "name",
    subtitleField: "role",
    sort: { sortOrder: 1, _id: 1 },
    fields: [
      { name: "name", label: "Project name", type: "text", required: true },
      { name: "role", label: "Your role", type: "text", placeholder: "Founder / Full-Stack Developer" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "image", label: "Screenshot", type: "image" },
      { name: "link", label: "Live site URL", type: "url" },
      { name: "repo", label: "Source code URL", type: "url" },
      { name: "tech", label: "Technologies", type: "tags", placeholder: "React, Node.js, MongoDB" },
      { name: "featured", label: "Featured project", type: "checkbox" },
      { name: "sortOrder", label: "Display order", type: "number", hint: "Lower numbers show first." }
    ]
  },
  achievements: {
    label: "Achievements",
    singular: "Achievement",
    titleField: "title",
    subtitleField: "issuer",
    sort: { sortOrder: 1, _id: 1 },
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "issuer", label: "Issued / awarded by", type: "text" },
      { name: "date", label: "Date", type: "text", placeholder: "March 2025" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "image", label: "Certificate or photo", type: "image" },
      { name: "link", label: "Link (verification, article…)", type: "url" },
      { name: "sortOrder", label: "Display order", type: "number", hint: "Lower numbers show first." }
    ]
  },
  experience: {
    label: "Experience & Leadership",
    singular: "Role",
    titleField: "role",
    subtitleField: "org",
    sort: { sortOrder: 1, _id: 1 },
    fields: [
      { name: "role", label: "Role / office", type: "text", required: true },
      { name: "org", label: "Organisation", type: "text" },
      {
        name: "category",
        label: "Section",
        type: "select",
        options: ["Professional", LEADERSHIP],
        hint: `"${LEADERSHIP}" appears in its own section on the site.`
      },
      { name: "date", label: "Dates", type: "text", placeholder: "Jan 2020 — Dec 2023" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "sortOrder", label: "Display order", type: "number", hint: "Lower numbers show first." }
    ]
  },
  skills: {
    label: "Skills",
    singular: "Skill",
    titleField: "name",
    subtitleField: "category",
    sort: { _id: 1 },
    fields: [
      { name: "category", label: "Category", type: "text", required: true, hint: "Use an existing category name to add to that group." },
      { name: "name", label: "Skill", type: "text", required: true }
    ]
  },
  goals: {
    label: "Goals",
    singular: "Goal",
    titleField: "title",
    subtitleField: "status",
    sort: { _id: 1 },
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "status", label: "Status", type: "select", options: ["planned", "in-progress", "done"] },
      { name: "targetDate", label: "Target date", type: "date" },
      { name: "progress", label: "Progress (0–100)", type: "number", min: 0, max: 100 }
    ]
  },
  profile: {
    label: "Profile",
    singular: "Profile",
    singleton: true,
    fields: [
      { name: "photo", label: "Profile photo", type: "image" },
      { name: "roleLine", label: "Role line", type: "text", hint: 'Separate titles with "/".' },
      { name: "lede", label: "Intro (hero text)", type: "textarea" },
      { name: "about", label: "About", type: "textarea", rows: 10, hint: "Leave a blank line between paragraphs." },
      { name: "quickFacts", label: "Quick facts", type: "pairs", rows: 6, hint: 'One per line, e.g. "Focus: AI automation".' }
    ]
  }
};

export function getCollection(key) {
  return Object.hasOwn(collections, key) ? collections[key] : null;
}

// Converts a stored document value into what the form input should show.
export function toInputValue(field, value) {
  if (value == null) return field.type === "checkbox" ? false : "";
  switch (field.type) {
    case "tags":
      return (value || []).join(", ");
    case "date":
      return new Date(value).toISOString().slice(0, 10);
    case "pairs":
      return (value || []).map((p) => `${p.k}: ${p.v}`).join("\n");
    default:
      return value;
  }
}

// Converts submitted FormData into a plain object for Mongoose.
export function parseForm(fields, formData) {
  const data = {};
  for (const field of fields) {
    const raw = formData.get(field.name);
    const str = typeof raw === "string" ? raw.trim() : "";
    switch (field.type) {
      case "checkbox":
        data[field.name] = raw === "on";
        break;
      case "number":
        data[field.name] = str === "" ? 0 : Number(str);
        break;
      case "tags":
        data[field.name] = str.split(",").map((s) => s.trim()).filter(Boolean);
        break;
      case "date":
        data[field.name] = str ? new Date(str) : null;
        break;
      case "pairs":
        data[field.name] = str
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            const i = line.indexOf(":");
            return i === -1 ? { k: line, v: "" } : { k: line.slice(0, i).trim(), v: line.slice(i + 1).trim() };
          });
        break;
      default:
        data[field.name] = str;
    }
  }
  return data;
}
