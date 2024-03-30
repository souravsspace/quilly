import { db } from "@/server/db";
import PdfRenderer from "@/components/PdfRenderer";
import ChatWrapper from "@/components/ChatWrapper";

import { notFound, redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

type Props = {
  params: {
    fileId: string;
  };
};

export default async function File({ params: { fileId } }: Props) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) redirect(`/auth-callback?origin=dashboard/${fileId}`);

  const dbFile = await db.file.findUnique({
    where: {
      id: fileId,
      userId: user.id,
    },
  });

  if (!dbFile) notFound();

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-1 flex-col justify-between">
      <div className="mx-auto w-full max-w-screen-8xl grow lg:flex xl:px-2">
        {/* Left sidebar & main wrapper */}
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <PdfRenderer url={dbFile.url} />
          </div>
        </div>

        {/* Right sidebar */}
        <div className="flex-[0.75] shrink-0 border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper />
        </div>
      </div>
    </div>
  );
}
