import { SignInForm } from "@/components/auth/sign-in-form";
import { SignInHero } from "@/components/auth/sign-in-hero";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const SignInPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }
  return (
    <main className="flex min-h-screen bg-background">
      {/* Left Column - Hero Section */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary via-primary to-secondary items-center justify-center p-12">
        <SignInHero />
      </div>

      {/* Right Column - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <SignInForm />
      </div>
    </main>
  );
};

export default SignInPage;
