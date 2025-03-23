"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export const navItems = [
  {
    pathName: "Dashboard",
    icon: "/assets/icons/dashboard.svg",
    url: "/",
  },
  {
    pathName: "Documents",
    icon: "/assets/icons/documents.svg",
    url: "/documents",
  },
  {
    pathName: "Images",
    icon: "/assets/icons/images.svg",
    url: "/images",
  },
  {
    pathName: "Media",
    icon: "/assets/icons/video.svg",
    url: "/media",
  },
  {
    pathName: "Others",
    icon: "/assets/icons/others.svg",
    url: "/others",
  },
];

const LeftSidebar = () => {
  const path = usePathname();
  console.log(path, "here is pathname");

  return (
    <nav className="hidden h-full w-[20rem] flex-col gap-4 p-6 lg:flex">
      <Link href="/" className="mb-6">
        <Image
          src="/assets/icons/logo-full-brand.svg"
          alt="logo"
          width={160}
          height={50}
          className="hidden h-auto lg:block"
        />

        <Image src="/assets/icons/logo-brand.svg" alt="logo" width={52} height={52} className="lg:hidden" />
      </Link>
      {navItems.map(({ pathName, icon, url }, idx) => {
        return (
          <Link
            href={url}
            key={idx}
            className={cn(
              "h5 text-dark-grey flex gap-4 px-8 py-4",
              path === url && "bg-light-orange rounded-full text-white",
            )}
          >
            <Image
              src={icon}
              width={26}
              height={26}
              alt=""
              className={cn("opacity-25 invert", path === url && "opacity-100 invert-0")}
            />
            <div className="!h5">{pathName}</div>
          </Link>
        );
      })}

      <div className="mt-auto flex flex-col gap-8">
        <Image src={"/assets/images/files-2.png"} width={506} height={418} alt="" />
        <div className="flex items-center gap-4">
          <Image src={"/assets/icons/logo"} className="rounded-full" alt="" width={24} height={24} />
          <div className="flex flex-col">
            <span className="h5 text-dark-grey">Bishal Lamichhane</span>
            <span className="text-light-grey body2">bishal.lamichhane@gmail.com</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LeftSidebar;
