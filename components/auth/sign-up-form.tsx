"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import Link from "next/link";

export function SignUpForm() {
  const [loadingProvider, setLoadingProvider] = useState<"google" | "github" | null>(null);

  const handleSocialSignUp = async (provider: "google" | "github") => {
    try {
      setLoadingProvider(provider);
      await signIn.social({
        provider,
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error(`Sign-up with ${provider} failed:`, error);
      toast.error(`Failed to sign up with ${provider === "google" ? "Google" : "GitHub"}. Please try again.`);
      setLoadingProvider(null);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-2">
          <Sparkles className="size-3.5" />
          <span>Instant Setup</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Join Routini
        </h1>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Turn your ambitions into daily habits with AI in seconds. Fast, secure 1-click sign up.
        </p>
      </div>

      {/* Social Auth Buttons */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          disabled={loadingProvider !== null}
          onClick={() => handleSocialSignUp("google")}
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
          onClick={() => handleSocialSignUp("github")}
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

      {/* Trust & Policy Footer */}
      <div className="space-y-4 text-center text-xs sm:text-sm text-muted-foreground">
        <p className="text-xs text-muted-foreground/80 leading-relaxed">
          By signing up, you agree to our{" "}
          <Link
            href="/terms-and-conditions"
            className="text-primary hover:underline font-medium"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/terms-and-conditions"
            className="text-primary hover:underline font-medium"
          >
            Privacy Policy
          </Link>
          .
        </p>

        <p className="pt-2 border-t border-border/50">
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
