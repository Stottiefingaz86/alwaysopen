import { AdminStartClient } from "@/app/admin/start/admin-start-client";
import { requireAdminSession } from "@/lib/admin/require-admin";
import { redirect } from "next/navigation";

export default async function AdminStartPage() {
  const session = await requireAdminSession();
  if (!session.ok) redirect("/login");

  return <AdminStartClient userEmail={session.user.email ?? ""} />;
}
