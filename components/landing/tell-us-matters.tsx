import { Button } from "@/components/ui/button"

export function TellUsMatters() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <img
              src="/person-working-at-desk.jpg"
              alt="Tell us what matters"
              className="w-full rounded-lg object-cover"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">Tell us what matters to you</h2>
            <p className="text-foreground/70 leading-relaxed">
              Whether it's fitness, learning, mindfulness, or anything else—Routini adapts to your unique goals and
              creates personalized habits that stick.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start your journey
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
