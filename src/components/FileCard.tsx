import { Models } from "node-appwrite";
import Link from "next/link";
import { cn, convertFileSize } from "@/lib/utils";
import Thumbnail from "./Thumbnail";
import ActionDropdown from "./ActionDropDown";
import { formatDateTime } from "./ui/formatDateTime";

const FileCard = ({ file }: { file: Models.Document }) => {
  return (
    <Link
      href={file.url}
      target="_blank"
      className="hover:shadow-drop-3 flex cursor-pointer flex-col gap-6 rounded-[18px] bg-white p-5 shadow-sm transition-all"
    >
      <div className="flex justify-between">
        <Thumbnail
          type={file.type}
          extension={file.extension}
          url={file.url}
          className="!size-20"
          imageClassName="!size-11"
        />

        <div className="flex cursor-pointer flex-col items-end justify-between">
          <ActionDropdown file={file} />
          <p className="body1">{convertFileSize(file.size)}</p>
        </div>
      </div>

      <div className="text-dark-grey flex flex-col gap-2">
        <p className="subtitle2 line-clamp-1">{file.name}</p>
        <p className={cn("body-1 body2 text-dark-grey")}>{formatDateTime(file.$createdAt)}</p>
        <p className="caption text-light-grey line-clamp-1">By: {file.owner.fullName}</p>
      </div>
    </Link>
  );
};
export default FileCard;
