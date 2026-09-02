"use client";

import { useState } from "react";
import { Eye, EyeOff, Check, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";
import { FaGithub } from "react-icons/fa";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import Link from "next/link";

const signUpFormSchema = z
  .object({
    displayName: z
      .string()
      .trim()
      .min(2, "Display name must be at least 2 characters"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters")
      .regex(
        /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/,
        "Username can only contain lowercase letters, numbers, and single dots, dashes, or underscores between characters"
      )
      .refine(
        (username) => !/^[._-]|[._-]$/.test(username),
        "Username cannot start or end with a special character"
      ),
    email: z.email("Invalid email address"),
    password: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      displayName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof signUpFormSchema>) => {
    // TODO - Add sign up logic

    console.log(values);
  };

  return (
    <div className="w-full max-w-md">
      {/* Social Login Buttons */}
      <div className="space-y-3 mb-8">
        <Button
          variant={"ghost"}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-lg  transition-colors font-medium"
        >
          <FcGoogle size={20} className="w-5 h-5 " />
          Continue with Google
        </Button>

        <Button
          variant={"ghost"}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-lg hover:bg-[#1877F2] transition-colors font-medium"
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
            Or sign up with email
          </span>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Display Name */}
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Display Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    className="bg-input border-border focus:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="johndoe"
                    {...field}
                    className="bg-input border-border focus:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                    className="bg-input border-border focus:ring-primary"
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
                <FormLabel className="text-sm font-medium">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                      className="bg-input border-border focus:ring-primary pr-10"
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

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                      className="bg-input border-border focus:ring-primary pr-10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
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

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Start Building Routines
              </>
            )}
          </Button>
        </form>
      </Form>

      {/* Footer Links */}
      <div className="mt-8 space-y-4 text-center text-sm text-muted-foreground">
        <p>
          By signing up, you agree to our{" "}
          <Link
            href={"/terms-and-conditions"}
            className="text-primary hover:underline font-medium"
          >
            Terms & Privacy Policy
          </Link>
        </p>
        <p>
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="text-primary hover:underline font-medium"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
