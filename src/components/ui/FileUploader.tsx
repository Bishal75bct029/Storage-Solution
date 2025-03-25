"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Thumbnail from "@/components/ui/Thumbnail";
import { MAX_FILE_SIZE } from "@/constants";
import { usePathname } from "next/navigation";
import { convertFileToUrl } from "./formatDateTime";
import { getFileType } from "./getFileType";
import { uploadFile } from "@/actions/files.action";

interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}

const FileUploader = ({ ownerId, accountId, className }: Props) => {
  const path = usePathname();
  //   const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  console.log(files, "here is me");

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      console.log(acceptedFiles, "accepted");
      setFiles(acceptedFiles);

      const uploadPromises = acceptedFiles.map(async (file) => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));

          return;
          //   toast({
          //     description: (
          //       <p className="body-2 text-white">
          //         <span className="font-semibold">{file.name}</span> is too large. Max file size is 50MB.
          //       </p>
          //     ),
          //     className: "error-toast",
          //   });
        }

        return uploadFile({ file, ownerId, accountId, path }).then((uploadedFile) => {
          console.log("boy");
          if (uploadedFile) {
            setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
          }
        });
      });

      await Promise.all(uploadPromises);
    },
    [ownerId, accountId, path],
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleRemoveFile = (e: React.MouseEvent<HTMLImageElement, MouseEvent>, fileName: string) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button
        type="button"
        className={cn(
          "bg-dark-orange hover:bg-light-orange shadow-drop-1 body2 h-[52px] gap-2 rounded-full px-10 transition-all",
          className,
        )}
      >
        <Image src="/assets/icons/upload.svg" alt="upload" width={24} height={24} /> <p>Upload</p>
      </Button>
      {files.length > 0 && (
        <ul className="shadow-drop-3 fixed right-10 bottom-10 z-50 flex size-full h-fit max-w-[480px] flex-col gap-3 rounded-[20px] bg-white p-7">
          <h4 className="h4 text-light-100">Uploading</h4>

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);

            return (
              <li
                key={`${file.name}-${index}`}
                className="shadow-drop-3 flex items-center justify-between gap-3 rounded-xl p-3"
              >
                <div className="flex items-center gap-3">
                  <Thumbnail type={type} extension={extension} url={convertFileToUrl(file)} />

                  <div className="subtitle2 mb-2 line-clamp-1 max-w-[300px]">
                    {file.name}
                    <Image src="/assets/icons/file-loader.gif" width={80} height={26} alt="Loader" />
                  </div>
                </div>

                <Image
                  src="/assets/icons/remove.svg"
                  width={24}
                  height={24}
                  alt="Remove"
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;
