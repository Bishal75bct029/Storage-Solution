import Image from "next/image";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen items-center justify-center gap-32 lg:items-start lg:justify-start">
      <div className="bg-light-orange hidden h-full w-[30%] min-w-[35rem] flex-col justify-between px-20 py-20 text-white lg:flex">
        <div className="flex gap-4">
          <Image src={"assets/icons/authLogo.svg"} height={60} width={60} alt="" />
          <span className="font-500 text-[2.25rem] tracking-tight">StoreIt</span>
        </div>
        <div className="flex flex-col gap-4">
          <span className="font-700 text-[46px] leading-14">Manage your files the best way</span>
          <span className="body1">Awesome we have created perfect place for you to store all of your documents.</span>
        </div>
        <Image src="/assets/images/files.png" height={340} width={340} alt="" />
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;
