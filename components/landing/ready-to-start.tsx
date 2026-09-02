import { Button } from "@/components/ui/button"

export function ReadyToStart() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold">Ready to start building</h2>
        <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
          Start your journey today. Turn your biggest goals into daily habits that stick.
        </p>
        <Button
          size="lg"
          variant="secondary"
          className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
        >
          Get started free
        </Button>
      </div>
    </section>
  )
}
