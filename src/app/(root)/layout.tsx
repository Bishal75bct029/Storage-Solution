import React from "react";
import LeftSidebar from "@/components/ui/LeftSidebar";
import Header from "@/components/ui/Header";
import { getCurrentUser } from "@/actions";
import { redirect } from "next/navigation";
import MobileNav from "@/components/ui/MobileNav";

const layout = async ({ children }: { children: Promise<React.ReactNode> }) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return redirect("/sign-in");

  return (
    <div className="flex h-screen">
      <LeftSidebar user={currentUser} />
      <div className="flex h-full w-full flex-col gap-4">
        <MobileNav user={currentUser} />
        <Header userId={currentUser.$id} accountId={currentUser.accountId} />
        {await children}
      </div>
    </div>
  );
};

export default layout;
