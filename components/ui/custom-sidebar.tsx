"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Button } from "./button";
import {
  LayoutDashboard,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "../Logo";
import AccountDropdownForSidebar from "@/components/navigation/account-dropdown";

const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_COLLAPSED_WIDTH = "4.25rem";

const NavLinks = [
  {
    id: 1,
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: 2,
    title: "Progress",
    href: "/dashboard/progress",
    icon: TrendingUp,
  },
];

const CustomSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const pathName = usePathname();

  return (
    <aside
      className={cn(
        "sticky top-0 z-30 hidden md:flex flex-col h-screen max-h-screen",
        "bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-in-out select-none"
      )}
      aria-label="Sidebar navigation"
      style={{
        width: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
      }}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center p-3 shrink-0",
          isCollapsed ? "flex-col gap-1 justify-center" : "justify-between"
        )}
      >
        <Logo isCollapsed={isCollapsed} />
        <Button
          onClick={toggleSidebar}
          className="size-9 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
          variant="ghost"
          size="icon"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!isCollapsed}
        >
          {isCollapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </Button>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 w-full flex-1 overflow-y-auto px-2 py-2">
        {NavLinks.map((link) => {
          const isActive = pathName === link.href;
          return (
            <NavItem
              key={link.id}
              title={link.title}
              href={link.href}
              icon={link.icon}
              isActive={isActive}
              isCollapsed={isCollapsed}
            />
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto p-2 w-full shrink-0 border-t border-sidebar-border/40">
        <AccountDropdownForSidebar isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
};

type NavItemProps = {
  title: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isActive: boolean;
  isCollapsed: boolean;
};

const NavItem = ({
  title,
  href,
  icon: Icon,
  isActive,
  isCollapsed,
}: NavItemProps) => (
  <Link
    href={href}
    aria-current={isActive ? "page" : undefined}
    className={cn(
      "flex items-center h-10 w-full rounded-xl font-medium text-sm transition-colors duration-150",
      isCollapsed ? "justify-center px-2" : "justify-start px-3 gap-3",
      isActive
        ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs"
        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground"
    )}
    title={isCollapsed ? title : undefined}
  >
    <Icon className="size-4 shrink-0" />
    {!isCollapsed && (
      <span className="truncate whitespace-nowrap">
        {title}
      </span>
    )}
  </Link>
);

export default CustomSidebar;
