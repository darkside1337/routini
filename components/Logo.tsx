import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  isCollapsed?: boolean;
}

const Logo: React.FC<LogoProps> = ({ isCollapsed = false }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center font-bold text-xl text-primary shrink-0 tracking-tight",
        isCollapsed ? "p-1" : "px-2 py-1"
      )}
    >
      {isCollapsed ? "R" : "Routini"}
    </div>
  );
};

export default Logo;
