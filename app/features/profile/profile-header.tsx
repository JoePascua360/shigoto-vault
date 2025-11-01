import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFileUpload } from "@/hooks/use-file-upload";
import { ImageIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfileHeader({
  imageSrc,
}: {
  imageSrc: string | undefined;
}) {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
      maxSize: 10 * 1024 * 1024, // 10MB
    });

  const previewUrl = files[0]?.preview || null;
  const fileName = files[0]?.file.name || null;

  return (
    <>
      <div className="flex items-center flex-col gap-2">
        <CardTitle className="font-secondary-header">User Profile</CardTitle>
        <CardDescription className="mb-4 font-sub-text">
          Manage your profile, username and password here.
        </CardDescription>
      </div>
      <header className="flex items-center justify-center gap-4 flex-wrap">
        {imageSrc ? (
          <Avatar className="size-20">
            <AvatarImage
              src={
                // if previewUrl is provided, image is already changed.
                previewUrl ? previewUrl : imageSrc
              }
              referrerPolicy="no-referrer"
              alt="@shadcn"
            />
            <AvatarFallback className="text-2xl">CN</AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="size-20 border-dotted border-2 flex justify-center items-center">
            <ImageIcon className="size-8" />
            <input className="sr-only" type="file" />
          </Avatar>
        )}
        <section className="space-y-2">
          <article className="flex gap-2 flex-wrap justify-center">
            <div className="relative inline-block">
              <Button
                onClick={openFileDialog}
                aria-haspopup="dialog"
                className="cursor-pointer"
                variant={`${fileName ? "secondary" : "default"}`}
              >
                <Upload />
                {imageSrc ? "Change Image" : "Upload Image"}
              </Button>
              <input
                {...getInputProps()}
                className="sr-only"
                aria-label="Upload image file"
                tabIndex={-1}
              />
            </div>
            {fileName && (
              <div className="relative inline-flex">
                <Button className="cursor-pointer">Submit</Button>
              </div>
            )}
          </article>

          <p className="text-sm">PNG, JPG or GIF. 10MB max.</p>
          {fileName && (
            <div className="inline-flex gap-1 text-xs items-center">
              <p className="truncate text-muted-foreground" aria-live="polite">
                {fileName}
              </p>{" "}
              <button
                onClick={() => removeFile(files[0]?.id ?? "")}
                className="font-medium text-destructive hover:underline cursor-pointer"
                aria-label={`Remove ${fileName}`}
                title={`Remove ${fileName}`}
              >
                Remove
              </button>
            </div>
          )}
        </section>
      </header>
    </>
  );
}
