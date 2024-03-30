"use client";

import Link from "next/link";
import { format } from "date-fns";
import { api } from "@/trpc/react";
import Skeleton from "react-loading-skeleton";
import { Button } from "@/components/ui/button";
import UploadButton from "@/components/UploadButton";
import { Ghost, Loader2, MessageSquare, Plus, Trash } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const utils = api.useUtils();

  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<
    string | null
  >("");

  const { data: files, isLoading } = api.user.getUserFiles.useQuery();
  const { mutate: deleteFile } = api.user.deleteFile.useMutation({
    onSuccess: async () => {
      await utils.user.getUserFiles.invalidate();
    },
    onMutate: ({ id }) => {
      setCurrentlyDeletingFile(id);
    },
    onSettled: () => {
      setCurrentlyDeletingFile(null);
    },
  });

  return (
    <main className="mx-auto max-w-7xl md:p-10">
      <div className="mx-1 mt-8 flex items-center justify-between gap-4 border-b border-gray-200 pb-5 sm:items-center sm:gap-0">
        <h1 className="mb-3 text-3xl font-bold text-gray-900 md:text-5xl">
          My Files
        </h1>

        <UploadButton />
      </div>

      {/* display all user files */}
      {files && files?.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .map((file) => (
              <li
                key={file.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
              >
                <Link
                  href={`/dashboard/${file.id}`}
                  className="flex flex-col gap-2"
                >
                  <div className="flex w-full items-center justify-between space-x-6 px-6 pt-6">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-lg font-medium capitalize text-zinc-900">
                          {file.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="mt-4 grid grid-cols-3 place-items-center gap-6 px-6 py-2 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Plus className="size-4" />
                    {format(new Date(file.createdAt), "MMM yyyy")}
                  </div>

                  <div className="flex items-center gap-2">
                    <MessageSquare className="size-4" />
                    Mocked
                  </div>

                  <Button
                    size="sm"
                    className="w-full"
                    variant="destructive"
                    onClick={() => deleteFile({ id: file.id })}
                  >
                    {currentlyDeletingFile === file.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash className="size-4" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <div className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((_, i) => (
            <Skeleton key={i} height={100} className="mt-4" />
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="text-xl font-semibold">Pretty empty around here</h3>
          <p>Let&apos;s upload your first PDF.</p>
        </div>
      )}
    </main>
  );
}
