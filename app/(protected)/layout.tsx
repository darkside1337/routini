import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import BottomBar from "@/components/navigation/bottom-bar";
import CustomSidebar from "@/components/ui/custom-sidebar";
import React from "react";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] min-h-screen w-full">
      <CustomSidebar />
      <div className="flex flex-col min-h-screen md:ml-0 min-w-0 w-full">
        <MaxWidthWrapper className="min-w-0 w-full">
          {/* 1280px max width */}
          <main className="min-w-0 w-full">{children}</main>
        </MaxWidthWrapper>
        <BottomBar />
      </div>
    </div>
  );
}
