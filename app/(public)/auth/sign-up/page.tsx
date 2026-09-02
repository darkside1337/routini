import { SignUpForm } from "@/components/auth/sign-up-form";
import { SignUpHero } from "@/components/auth/sign-up-hero";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
const SignUpPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen bg-background">
      {/* Left Column - Hero Section */}
      <div className="hidden lg:flex w-1/2 bg-linear-to-br from-primary via-primary to-secondary items-center justify-center p-12">
        <SignUpHero />
      </div>

      {/* Right Column - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <SignUpForm />
      </div>
    </main>
  );
};

export default SignUpPage;
