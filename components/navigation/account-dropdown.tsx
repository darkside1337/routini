"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Moon,
  Sun,
  LogOut,
  ChevronsUpDown,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AccountDropdownForSidebarProps {
  isCollapsed?: boolean;
}

export function AccountDropdownForSidebar({
  isCollapsed = false,
}: AccountDropdownForSidebarProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const getUserInitials = (name?: string | null, email?: string | null) => {
    if (name?.trim()) {
      return name
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email?.trim()) {
      return email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully");
            router.replace("/auth/sign-in");
          },
        },
      });
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

  if (isPending) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg p-1.5 w-full",
          isCollapsed ? "justify-center" : "justify-start"
        )}
      >
        <Skeleton className="size-8 rounded-lg shrink-0" />
        {!isCollapsed && (
          <div className="flex-1 space-y-1.5 min-w-0">
            <Skeleton className="h-3.5 w-24 rounded" />
            <Skeleton className="h-2.5 w-32 rounded" />
          </div>
        )}
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayName = user.name || "User";
  const initials = getUserInitials(user.name, user.email);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          aria-label="User account menu"
          className={cn(
            "w-full h-11 p-2 rounded-xl transition-colors flex items-center gap-2.5",
            "hover:bg-accent/15 focus-visible:ring-2 focus-visible:ring-ring",
            open && "bg-accent/20 text-accent-foreground",
            isCollapsed ? "justify-center px-1" : "justify-start px-2.5"
          )}
        >
          <Avatar className="size-7 rounded-lg shrink-0 border border-border/50">
            <AvatarImage src={user.image ?? undefined} alt={displayName} />
            <AvatarFallback className="rounded-lg text-xs font-semibold bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>

          {!isCollapsed && (
            <>
              <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                <span className="truncate font-semibold text-foreground text-xs">
                  {displayName}
                </span>
                <span className="truncate text-[11px] text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-3.5 text-muted-foreground/70 shrink-0" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-60 rounded-xl p-1.5 shadow-xl border-border/80"
        side={isCollapsed ? "right" : "top"}
        align={isCollapsed ? "end" : "start"}
        sideOffset={8}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2.5 px-2 py-2 text-left text-sm rounded-lg bg-muted/40">
            <Avatar className="size-8 rounded-lg shrink-0 border border-border/50">
              <AvatarImage src={user.image ?? undefined} alt={displayName} />
              <AvatarFallback className="rounded-lg text-xs font-semibold bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
              <span className="truncate font-semibold text-foreground text-xs">
                {displayName}
              </span>
              <span className="truncate text-[11px] text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1.5" />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="cursor-pointer gap-2.5 py-2 px-2.5 rounded-lg text-xs font-medium"
          >
            {theme === "dark" ? (
              <Sun className="size-4 text-amber-500" />
            ) : (
              <Moon className="size-4 text-indigo-500" />
            )}
            <span>Theme: {theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push("/settings")}
            className="cursor-pointer gap-2.5 py-2 px-2.5 rounded-lg text-xs font-medium"
          >
            <Settings className="size-4 text-muted-foreground" />
            <span>Account Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1.5" />

        <DropdownMenuItem
          onClick={handleSignOut}
          variant="destructive"
          className="cursor-pointer gap-2.5 py-2 px-2.5 rounded-lg text-xs font-medium text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <LogOut className="size-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AccountDropdownForSidebar;
