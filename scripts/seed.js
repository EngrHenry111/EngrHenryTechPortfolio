// One-time migration script: reads the existing /data/*.json files and
// inserts their content into MongoDB via the Mongoose models in /models.
// Usage: npm run seed

require("dotenv").config({ path: ".env.local" });
require("dotenv").config({ path: ".env" }); // fallback: fills in anything .env.local doesn't set

const fs = require("fs");
const path = require("path");

function readJSON(file) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", file), "utf-8"));
}

async function main() {
  const { connectDB } = await import("../lib/mongodb.js");
  const { default: Project } = await import("../models/Project.js");
  const { default: Skill } = await import("../models/Skill.js");
  const { default: Experience } = await import("../models/Experience.js");
  const { default: Profile } = await import("../models/Profile.js");

  await connectDB();

  // --- Projects ---
  const projectsData = readJSON("projects.json").map((p) => ({
    name: p.name,
    role: p.role,
    description: p.description,
    image: p.image,
    link: p.link,
    repo: p.repo,
    tech: p.tech,
    featured: p.featured
  }));
  await Project.deleteMany({});
  const projects = await Project.insertMany(projectsData);
  console.log(`Seeded ${projects.length} Project documents.`);

  // --- Experience ---
  const experienceData = readJSON("experience.json").map((e, i) => ({
    role: e.role,
    org: e.org,
    date: e.date,
    description: e.desc,
    sortOrder: i
  }));
  await Experience.deleteMany({});
  const experience = await Experience.insertMany(experienceData);
  console.log(`Seeded ${experience.length} Experience documents.`);

  // --- Skills (flatten grouped items into one document per skill) ---
  const skillGroups = readJSON("skills.json");
  const skillsData = [];
  for (const group of skillGroups) {
    for (const item of group.items) {
      skillsData.push({ category: group.group, name: item });
    }
  }
  await Skill.deleteMany({});
  const skills = await Skill.insertMany(skillsData);
  console.log(`Seeded ${skills.length} Skill documents.`);

  // --- Profile (single document) ---
  const profileData = readJSON("profile.json");
  await Profile.deleteMany({});
  const profile = await Profile.create({
    photo: profileData.photo,
    roleLine: "Electrical Engineer / Full-Stack Developer / AI Engineering Student",
    lede: profileData.lede,
    about: profileData.about.join("\n\n"),
    quickFacts: profileData.quickFacts
  });
  console.log(`Seeded Profile document (${profile._id}).`);

  console.log(
    "\nNote: no data/achievements.json or data/goals.json exist yet, so the " +
      "Achievement and Goal collections were left empty (models are ready for future content)."
  );

  await require("mongoose").disconnect();
  console.log("\nDone.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
