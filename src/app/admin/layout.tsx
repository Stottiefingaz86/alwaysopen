import { requireAdminSession } from "@/lib/admin/require-admin";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "RingsAway Backoffice",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();
  if (!session.ok) {
    redirect("/login");
  }

  return children;
}
