import { Models } from "node-appwrite";
import { cn, convertFileSize } from "@/lib/utils";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Thumbnail from "./Thumbnail";
import { formatDateTime } from "./ui/formatDateTime";
import { useForm } from "react-hook-form";

const ImageThumbnail = ({ file }: { file: Models.Document }) => (
  <div className="file-details-thumbnail">
    <Thumbnail type={file.type} extension={file.extension} url={file.url} />
    <div className="flex flex-col">
      <p className="subtitle2 my-2 mb-0">{file.name}</p>
      <p className={cn("body1 text-dark-grey caption")}>{formatDateTime(file.$createdAt)}</p>
    </div>
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex">
    <p className="body2 text-dark-grey w-[30%] text-left">{label}</p>
    <p className="subtitle2 flex-1 text-left">{value}</p>
  </div>
);

export const FileDetails = ({ file }: { file: Models.Document }) => {
  return (
    <>
      <ImageThumbnail file={file} />
      <div className="space-y-4 px-2 pt-2">
        <DetailRow label="Format:" value={file.extension} />
        <DetailRow label="Size:" value={convertFileSize(file.size)} />
        <DetailRow label="Owner:" value={file.owner.fullName} />
        <DetailRow label="Last edit:" value={formatDateTime(file.$updatedAt)} />
      </div>
    </>
  );
};

interface Props {
  file: Models.Document;
  sharedEmails: string[];
  onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
  onRemove: (email: string) => void;
}

export const ShareInput = ({ file, onInputChange, onRemove, sharedEmails }: Props) => {
  return (
    <>
      <ImageThumbnail file={file} />
      <div className="!mt-2 space-y-2">
        <p className="subtitle2 text-dark-grey pl-1">Share file with other users</p>
        <Input
          type="email"
          placeholder="Enter email address"
          onChange={(e) => {
            const emails = e.target.value
              .split(",")
              .map((email) => email.trim())
              .filter((email) => email && !sharedEmails.includes(email));

            if (emails.length) {
              onInputChange([...emails]);
            }
          }}
          className="body2 !shad-no-focus !shadow-drop-1 h-[52px] w-full rounded-full border px-4"
        />
        <div className="pt-4">
          <div className="flex justify-between">
            <p className="subtitle2 text-dark-grey">Shared with</p>
            <p className="subtitle2 text-light-grey">{file.users.length} users</p>
          </div>

          <ul className="pt-2">
            {file.users.map((email: string) => (
              <li key={email} className="flex items-center justify-between gap-2">
                <p className="subtitle2">{email}</p>
                <Button
                  onClick={() => onRemove(email)}
                  className="text-dark-grey rounded-full bg-transparent shadow-none hover:bg-transparent"
                >
                  <Image
                    src="/assets/icons/remove.svg"
                    alt="Remove"
                    width={24}
                    height={24}
                    className="aspect-square rounded-full"
                  />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
