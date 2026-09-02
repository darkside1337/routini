"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { AccountDropdownForSidebar } from "./account-dropdown";
import { Button } from "../ui/button";
import {
  LayoutDashboard,
  Target,
  TrendingUp,
  Repeat,
  Settings,
} from "lucide-react";
const NavLinks = [
  {
    id: 1,
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  { id: 2, title: "Goals", href: "/goals", icon: Target },
  {
    id: 3,
    title: "Progress",
    href: "/progress",
    icon: TrendingUp,
  },
  { id: 4, title: "Habits", href: "/habits", icon: Repeat },
  {
    id: 5,
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];
export function AppSidebar() {
  /* const { state } = useSidebar(); */

  const handleNavigate = (href: string) => {
    // Implement navigation logic here, e.g., using Next.js router
    console.log(`Navigating to ${href}`);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader title="Routini">hello</SidebarHeader>
      <SidebarContent>
        <SidebarGroup title="Main">
          {NavLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Button
                key={link.id}
                variant={"link"}
                onClick={() => handleNavigate(link.href)}
                className="justify-start"
              >
                <IconComponent />
                {link.title}
              </Button>
            );
          })}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* contains avatar + displayname and email and a chevron up icon with dropdown menu with dark mode toggle and a logout buton */}
        <AccountDropdownForSidebar />
      </SidebarFooter>
    </Sidebar>
  );
}
