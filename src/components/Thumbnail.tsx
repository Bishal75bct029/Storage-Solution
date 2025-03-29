import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getFileIcon } from "../lib/getFileIcon";

interface Props {
  type: string;
  extension: string;
  url?: string;
  imageClassName?: string;
  className?: string;
}

const Thumbnail = ({ type, extension, url = "", imageClassName, className }: Props) => {
  const isImage = type === "image" && extension !== "svg";

  return (
    <figure className={cn("flex-center bg-brand/10 size-[50px] min-w-[50px] overflow-hidden rounded-full", className)}>
      <Image
        src={isImage ? url : getFileIcon(extension, type)}
        alt="thumbnail"
        width={100}
        height={100}
        className={cn(
          "size-8 object-contain",
          imageClassName,
          isImage && "!important size-full object-cover object-center",
        )}
      />
    </figure>
  );
};

export default Thumbnail;
