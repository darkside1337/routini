"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const router = useRouter();

  const handleNavigate = (url: string) => () => {
    router.push(url);
  };
  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Column - Image */}
          <div className="order-2 md:order-1">
            <Image
              src="/two-people-working-together.jpg"
              alt="People achieving goals"
              className="w-full rounded-lg object-cover"
              width={800}
              height={800}
            />
          </div>

          {/* Right Column - Content */}
          <div className="order-1 md:order-2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Turn goals into daily habits
            </h1>
            <p className="text-lg text-foreground/70 leading-relaxed">
              Routini makes it easy to set goals and break them down into
              achievable habits. Track your daily progress with our intuitive,
              distraction-free platform. Real goals. Real results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90"
                onClick={handleNavigate("/auth/sign-up")}
              >
                Start for free
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleNavigate("#how-it-works")}
              >
                See how it works
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
