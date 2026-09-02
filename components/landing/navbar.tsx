"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();

  const handleNavigate = (url: string) => () => {
    router.push(url);
  };

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary"></div>
          <span className="font-semibold text-lg">Routini</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            How it works
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Resources
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleNavigate("/auth/sign-in")}>
            Sign in
          </Button>
          <Button variant="secondary" onClick={handleNavigate("/auth/sign-up")}>
            Sign up
          </Button>
        </div>
      </div>
    </nav>
  );
}
