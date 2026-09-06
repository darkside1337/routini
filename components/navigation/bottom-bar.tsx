"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  TrendingUp,
  Settings,
} from "lucide-react";

import { AccountDropdownForBottomBar } from "@/components/navigation/account-dropdown";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/progress", label: "Progress", icon: TrendingUp },
  { href: "/settings", label: "Settings", icon: Settings },
];
const BottomBar = () => {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-sidebar border-t border-sidebar-border flex items-center justify-around h-16 z-40 px-1"
      aria-label="Mobile navigation"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex-1 flex justify-center min-w-0"
          >
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "w-10 h-10 rounded-lg",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-xs"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/20"
              )}
              title={item.label}
              aria-label={item.label}
            >
              <Icon className="w-5 h-5" />
            </Button>
          </Link>
        );
      })}

      <div className="flex-1 flex justify-center min-w-0">
        <AccountDropdownForBottomBar />
      </div>
    </nav>
  );
};

export default BottomBar;
