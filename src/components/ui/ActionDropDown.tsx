"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import Image from "next/image";
import { Models } from "node-appwrite";
import { actionsDropdownItems } from "@/constants";
import Link from "next/link";
import { constructDownloadUrl } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { deleteFile, renameFile, updateFileUsers } from "@/actions/files.action";
import { usePathname } from "next/navigation";
import { FileDetails, ShareInput } from "./ActionModalContent";
import { customToast } from "./sonner";

type ActionType = {
  label: string;
  icon: string;
  value: string;
};

const ActionDropdown = ({ file }: { file: Models.Document }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [name, setName] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);

  const path = usePathname();

  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(file.name);
    setEmails([]);
  };

  const handleAction = async () => {
    if (!action) return;
    setIsLoading(true);
    let success = false;

    const actions = {
      rename: () =>
        renameFile({ fileId: file.$id, name, extension: file.extension, path })
          .then(() => {
            customToast("File renamed successfully.", "success");
            return true;
          })
          .catch((e) => {
            customToast(e.message, "error");
            return false;
          }),
      share: () =>
        updateFileUsers({ fileId: file.$id, emails, path, isNewShare: true })
          .then(() => {
            customToast("File shared successfully.", "success");
            return true;
          })
          .catch((e) => {
            customToast(e.message, "error");
            return false;
          }),
      delete: () =>
        deleteFile({ fileId: file.$id, bucketFileId: file.bucketFileId, path })
          .then(() => {
            customToast("File deleted successfully.", "success");
            return true;
          })
          .catch((e) => {
            customToast(e.message, "error");
            return false;
          }),
    };

    success = !!(await actions[action.value as keyof typeof actions]());

    if (success) closeAllModals();

    setIsLoading(false);
  };

  const handleRemoveUser = async (email: string) => {
    const updatedEmails = file.users.filter((e: string) => e !== email);

    const success = await updateFileUsers({
      fileId: file.$id,
      emails: updatedEmails,
      isNewShare: false,
      path,
    })
      .then(() => {
        customToast("Successfully update share list.", "success");
        return true;
      })
      .catch((e) => {
        customToast(e.message, "error");
        return false;
      });

    if (success) setEmails(updatedEmails);
    closeAllModals();
  };

  const renderDialogContent = () => {
    if (!action) return null;

    const { value, label } = action;

    return (
      <DialogContent className="button outline-none focus:ring-0 focus:ring-offset-0 focus-visible:border-none focus-visible:ring-transparent focus-visible:ring-offset-0 focus-visible:outline-none">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-dark-grey text-center">{label}</DialogTitle>
          {value === "rename" && (
            <Input
              type="text"
              value={name}
              onChange={(e) => {
                e.stopPropagation();
                setName(e.target.value);
              }}
            />
          )}
          {value === "details" && <FileDetails file={file} />}
          {value === "share" && (
            <ShareInput sharedEmails={emails} file={file} onInputChange={setEmails} onRemove={handleRemoveUser} />
          )}
          {value === "delete" && (
            <p className="text-dark-grey text-center">
              Are you sure you want to delete{` `}
              <span className="text-dark-orange font-medium">{file.name}</span>?
            </p>
          )}
        </DialogHeader>
        {["rename", "delete", "share"].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button
              onClick={closeAllModals}
              className="text-dark-grey h-[52px] flex-1 rounded-full bg-white hover:bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={isLoading || (value === "share" && !emails.length)}
              className="bg-light-orange hover:bg-dark-orange button !mx-0 w-full flex-1 rounded-full transition-all"
            >
              <p className="capitalize">{value}</p>
              {isLoading && (
                <Image src="/assets/icons/loader.svg" alt="loader" width={24} height={24} className="animate-spin" />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image src="/assets/icons/dots.svg" alt="dots" width={34} height={34} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">{file.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((actionItem) => (
            <DropdownMenuItem
              key={actionItem.value}
              className="shad-dropdown-item"
              onClick={() => {
                setAction(actionItem);

                if (["rename", "share", "delete", "details"].includes(actionItem.value)) {
                  setIsModalOpen(true);
                }
              }}
            >
              {actionItem.value === "download" ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={file.name}
                  className="flex items-center gap-2"
                >
                  <Image src={actionItem.icon} alt={actionItem.label} width={30} height={30} />
                  {actionItem.label}
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Image src={actionItem.icon} alt={actionItem.label} width={30} height={30} />
                  {actionItem.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {renderDialogContent()}
    </Dialog>
  );
};
export default ActionDropdown;
