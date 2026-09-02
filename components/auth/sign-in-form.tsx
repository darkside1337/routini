"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { FaGithub } from "react-icons/fa";
const formSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(2, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const { isSubmitting } = form.formState;

  const handleGoogleSignIn = async () => {
    try {
      await signIn.social({ provider: "google", callbackURL: "/dashboard" });
      toast.success("Signed in with Google");
    } catch (error) {
      toast.error("Error signing in with Google");
      console.log(error);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await signIn.social({ provider: "github", callbackURL: "/dashboard" });
      toast.success("Signed in with Github");
    } catch (error) {
      toast.error("Error signing in with Github");
      console.log(error);
    }
  };

  const onSubmit = async (values: FormValues) => {
    // TODO - Add sign in logic

    console.log(values);
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 leading-tight text-center">
          Welcome Back
        </h1>
        <p className="text-muted-foreground">
          Continue building your habits and tracking your progress
        </p>
      </div>

      {/* Social Login Buttons */}
      <div className="space-y-3 mb-8">
        <Button
          variant="outline"
          className="w-full bg-transparent hover:cursor-pointer"
          size="lg"
          onClick={handleGoogleSignIn}
        >
          <FcGoogle size={20} className="w-5 h-5 " />
          Continue with Google
        </Button>

        <Button
          variant="outline"
          className="w-full bg-transparent hover:cursor-pointer hover:bg-[#1877F2]"
          size="lg"
          onClick={handleGithubSignIn}
        >
          <FaGithub size={20} className="w-5 h-5" />
          Continue with Github
        </Button>
      </div>

      {/* Divider */}
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground">
            Or sign in with email
          </span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="rememberMe"
              {...form.register("rememberMe")}
              className="w-4 h-4 rounded border-border cursor-pointer ml-auto"
            />
            <label
              htmlFor="rememberMe"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 hover:cursor-pointer"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Signing In...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </>
            )}
          </Button>
        </form>
      </Form>

      {/* Footer Links */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
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
