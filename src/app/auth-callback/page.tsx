import { api } from "@/trpc/server";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

type Props = {
  searchParams: { origin: string | undefined };
};

export default async function AuthCallback({ searchParams }: Props) {
  const origin = searchParams.origin;

  const { success, unauthorized } = await api.Auth.authCallback();

  if (unauthorized) redirect("/sign-in");
  if (success) redirect(origin ? `/${origin}` : "/dashboard");

  return (
    <div className="mt-24 flex w-full justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="size-8 animate-spin text-zinc-800" />
        <h3 className="text-xl font-semibold">
          Setting up your account, please wait...
        </h3>
        <p className="text-muted-foreground">
          You will be redirected to your dashboard once your account is ready.
        </p>
      </div>
    </div>
  );
}
