"use client";

import { useState } from "react";
import Dropzone from "react-dropzone";
import { Cloud, File, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/upload-things";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export default function UploadButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) setIsOpen(v);
      }}
    >
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button>Upload PDF</Button>
      </DialogTrigger>
      <DialogContent>
        <UploadDropzone />
      </DialogContent>
    </Dialog>
  );
}

function UploadDropzone() {
  const router = useRouter();

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const { toast } = useToast();
  const { startUpload } = useUploadThing("pdfUploader");

  const { mutate: startPolling } = api.user.getFiles.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`);
    },
    retry: true,
    retryDelay: 500,
  });

  const startSimulatated = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 500);

    return interval;
  };

  return (
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFiles) => {
        setIsUploading(true);
        const progressInterval = startSimulatated();

        //  handle file upload
        const uploadPdfResponse = await startUpload(acceptedFiles);

        if (!uploadPdfResponse) {
          toast({
            title: "Upload failed",
            description:
              "An error occurred while uploading the file, please try again later.",
            variant: "destructive",
          });
        }

        if (Array.isArray(uploadPdfResponse) && uploadPdfResponse.length > 0) {
          const [fileResponse] = uploadPdfResponse;
          const key = fileResponse?.key;

          if (key) {
            startPolling({ key });
          } else {
            toast({
              title: "Upload failed",
              description:
                "An error occurred while uploading the file, please try again later.",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Upload failed",
            description:
              "An error occurred while uploading the file, please try again later.",
            variant: "destructive",
          });
        }

        // const [fileResponse] = uploadPdfResponse;
        // const key: string = fileResponse?.key;

        // if (!key) {
        //   toast({
        //     title: "Upload failed",
        //     description:
        //       "An error occurred while uploading the file, please try again later.",
        //     variant: "destructive",
        //   });
        // }

        clearInterval(progressInterval);
        setUploadProgress(100);

        // startPolling({ key });
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="m-4 h-64 rounded-lg border border-gray-300"
        >
          <div className="flex h-full w-full items-center justify-center">
            <label
              htmlFor="dropzone-file"
              className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <Cloud className="mb-2 size-6 text-zinc-500" />
                <p className="mb-2 text-sm text-zinc-700">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-zinc-500">
                  {/* PDF (up to {isSubscribed ? "16" : "4"}MB) */}
                  PDF (Up to 4MB)
                </p>
              </div>

              {acceptedFiles[0] && acceptedFiles ? (
                <div className="flex max-w-xs items-center divide-x divide-zinc-200 overflow-hidden rounded-md bg-white outline outline-[1px] outline-zinc-200">
                  <div className="grid h-full place-items-center px-3 py-2">
                    <File className="size-5 text-blue-500" />
                  </div>
                  <div className="h-full truncate px-3 py-2 text-sm">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}

              {isUploading ? (
                <div className="mx-auto mt-4 w-full max-w-xs">
                  <Progress
                    indicatorColor={uploadProgress >= 85 ? "bg-green-500" : ""}
                    value={uploadProgress}
                    className="h-1 w-full bg-zinc-200"
                  />
                  {uploadProgress === 100 ? (
                    <div className="flex items-center justify-center gap-1 p-2 text-center text-sm text-zinc-700">
                      <Loader2 className="size-3 animate-spin" />
                      Redirecting...
                    </div>
                  ) : null}
                </div>
              ) : null}

              <input
                {...getInputProps}
                type="file"
                id="dropzone-file"
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
}
