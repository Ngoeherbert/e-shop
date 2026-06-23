import { AdminSettingsClient } from "@/components/admin/AdminSettingsClient";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";

export default async function AdminSettingsPage() {
  const settings = await db.query.siteSettings.findFirst().then((value) => value ?? null).catch(() => null);
  return <AdminSettingsClient settings={settings} />;
}
