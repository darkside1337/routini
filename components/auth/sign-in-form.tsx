"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import Link from "next/link";

export function SignInForm() {
  const [loadingProvider, setLoadingProvider] = useState<"google" | "github" | null>(null);

  const handleSocialSignIn = async (provider: "google" | "github") => {
    try {
      setLoadingProvider(provider);
      await signIn.social({
        provider,
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error(`Sign-in with ${provider} failed:`, error);
      toast.error(`Failed to sign in with ${provider === "google" ? "Google" : "GitHub"}. Please try again.`);
      setLoadingProvider(null);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Welcome Back
        </h1>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Sign in to access your goals, habit streaks, and personal routines.
        </p>
      </div>

      {/* Social Auth Buttons */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          disabled={loadingProvider !== null}
          onClick={() => handleSocialSignIn("google")}
          className="w-full h-12 flex items-center justify-center gap-3 px-4 rounded-xl border-border/80 hover:bg-accent/60 transition-all font-medium text-sm cursor-pointer shadow-xs disabled:opacity-60"
        >
          {loadingProvider === "google" ? (
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          ) : (
            <FcGoogle className="size-5 shrink-0" />
          )}
          <span>Continue with Google</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={loadingProvider !== null}
          onClick={() => handleSocialSignIn("github")}
          className="w-full h-12 flex items-center justify-center gap-3 px-4 rounded-xl border-border/80 hover:bg-accent/60 transition-all font-medium text-sm cursor-pointer shadow-xs disabled:opacity-60"
        >
          {loadingProvider === "github" ? (
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          ) : (
            <FaGithub className="size-5 shrink-0" />
          )}
          <span>Continue with GitHub</span>
        </Button>
      </div>

      {/* Footer Links */}
      <div className="space-y-4 text-center text-xs sm:text-sm text-muted-foreground">
        <p className="pt-2 border-t border-border/50">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/sign-up"
            className="text-primary hover:underline font-medium"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
