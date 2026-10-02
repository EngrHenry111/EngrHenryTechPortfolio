import Project from "@/models/Project";
import Achievement from "@/models/Achievement";
import Experience from "@/models/Experience";
import Skill from "@/models/Skill";
import Goal from "@/models/Goal";
import Profile from "@/models/Profile";

// Maps admin collection keys (see lib/admin-collections.js) to Mongoose models.
export const adminModels = {
  projects: Project,
  achievements: Achievement,
  experience: Experience,
  skills: Skill,
  goals: Goal,
  profile: Profile
};
