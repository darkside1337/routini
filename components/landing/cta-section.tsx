import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to start building</h2>
        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">Start your journey to achieving your goals today</p>
        <Button size="lg" variant="secondary">
          Get started free
        </Button>
      </div>
    </section>
  )
}
