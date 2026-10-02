import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { collections } from "@/lib/admin-collections";
import { adminModels } from "@/lib/admin-models";

export default async function AdminDashboard() {
  await requireAdmin();
  await connectDB();
  const entries = Object.entries(collections);
  const counts = await Promise.all(entries.map(([key]) => adminModels[key].countDocuments()));

  return (
    <>
      <h1>Dashboard</h1>
      <p className="adm-sub">Changes you save here appear on your portfolio straight away.</p>
      <div className="adm-tiles">
        {entries.map(([key, c], i) => (
          <Link key={key} href={`/admin/${key}`} className="adm-card adm-tile">
            <span className="adm-tile-count">{c.singleton ? "Edit" : counts[i]}</span>
            <span>{c.label}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
