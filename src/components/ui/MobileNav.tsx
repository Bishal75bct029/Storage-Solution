"use client";

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { navItems } from "./LeftSidebar";
import FileUploader from "./FileUploader";
import { logout } from "@/actions";
import { Models } from "node-appwrite";

const MobileNavigation = ({ user }: { user: Models.Document }) => {
  const { $id: ownerId, accountId, fullName, avatar, email } = user;

  const [open, setOpen] = useState(false);
  const path = usePathname();

  return (
    <header className="flex h-[60px] justify-between px-5 lg:hidden">
      <Image src="/assets/icons/logo-full-brand.svg" alt="logo" width={120} height={52} className="h-auto" />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image src="/assets/icons/menu.svg" alt="Search" width={30} height={30} className="cursor-pointer" />
        </SheetTrigger>
        <SheetContent className="shad-sheet h-screen px-3">
          <SheetTitle>
            <div className="text-light-100 sm:bg-brand/10 my-3 flex items-center gap-2 rounded-full p-1 sm:justify-center lg:justify-start lg:p-3">
              <Image
                src={avatar}
                alt="avatar"
                width={44}
                height={44}
                className="aspect-square w-10 rounded-full object-cover"
              />
              <div className="sm:hidden lg:block">
                <p className="h5 text-dark-grey capitalize">{fullName}</p>
                <p className="text-light-grey body2">{email}</p>
              </div>
            </div>
            <Separator className="bg-light-200/20 mb-4" />
          </SheetTitle>

          <nav className="h5 text-brand flex-1 gap-1">
            <ul className="flex flex-1 flex-col gap-4">
              {navItems.map(({ url, pathName, icon }) => (
                <Link key={pathName} href={url} className="lg:w-full">
                  <li
                    className={cn(
                      "text-light-100 h5 flex h-[52px] w-full items-center justify-start gap-4 rounded-full px-6",
                      path === url && "bg-light-orange rounded-full text-white",
                    )}
                  >
                    <Image
                      src={icon}
                      alt={pathName}
                      width={24}
                      height={24}
                      className={cn("opacity-25 invert", path === url && "opacity-100 invert-0")}
                    />
                    <p>{pathName}</p>
                  </li>
                </Link>
              ))}
            </ul>
          </nav>

          <Separator className="bg-light-200/20 my-5" />

          <div className="flex flex-col justify-between gap-5 pb-5">
            <FileUploader ownerId={ownerId} accountId={accountId} />
            <Button type="submit" className="mobile-sign-out-button" onClick={async () => await logout()}>
              <Image src="/assets/icons/logout.svg" alt="logo" width={24} height={24} />
              <p>Logout</p>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;
