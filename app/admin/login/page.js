import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <main className="adm-login">
      <div className="adm-card">
        <p className="adm-eyebrow">Portfolio admin</p>
        <h1>Log in</h1>
        <LoginForm />
      </div>
    </main>
  );
}
