import { AdminUsersClient } from "@/components/admin/AdminUsersClient";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export default async function AdminUsersPage() {
  const users = await db.select().from(user).orderBy(desc(user.createdAt)).catch(() => []);
  return <AdminUsersClient users={users} />;
}
