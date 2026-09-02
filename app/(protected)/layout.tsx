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
    <div className="grid grid-cols-[auto_1fr] min-h-screen">
      <CustomSidebar />
      <div className="flex flex-col min-h-screen md:ml-0">
        <MaxWidthWrapper>
          {/* 1280px max width */}
          <main>{children}</main>
        </MaxWidthWrapper>
        <BottomBar />
      </div>
    </div>
  );
}
