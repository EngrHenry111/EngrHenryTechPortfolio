import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { collections } from "@/lib/admin-collections";
import { logout } from "@/app/admin/actions";

export default async function AdminPanelLayout({ children }) {
  await requireAdmin();

  return (
    <div className="adm-shell">
      <aside className="adm-sidebar">
        <Link href="/admin" className="adm-brand">Portfolio admin</Link>
        <nav>
          {Object.entries(collections).map(([key, c]) => (
            <Link key={key} href={`/admin/${key}`}>{c.label}</Link>
          ))}
        </nav>
        <div className="adm-sidebar-foot">
          <a href="/" target="_blank" rel="noopener noreferrer">View site ↗</a>
          <form action={logout}>
            <button type="submit" className="adm-link-btn">Log out</button>
          </form>
        </div>
      </aside>
      <main className="adm-main">{children}</main>
    </div>
  );
}
