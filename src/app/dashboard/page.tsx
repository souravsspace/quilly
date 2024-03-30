import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { db } from "@/server/db";
import Dashboard from "@/components/Dashboard";

export default async function DashboardPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const redirectPath = "/auth-callback?origin=dashboard";
  if (!user) redirect(redirectPath);

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) redirect(redirectPath);

  return <Dashboard />;
}
