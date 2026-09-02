import { Card, CardContent } from "@/components/ui/card"

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "I struggled setting long-term habits before this. Routini made it actually possible.",
      author: "Sarah Chen",
      role: "Product Manager",
    },
    {
      quote: "The AI habit generation is insanely good. It understood exactly what I needed.",
      author: "Marcus Johnson",
      role: "Entrepreneur",
    },
    {
      quote: "Finally, an app that doesn't feel like a chore. Using it is actually enjoyable.",
      author: "Emma Rodriguez",
      role: "Designer",
    },
  ]

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What users say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} className="border border-border">
              <CardContent className="pt-6">
                <p className="text-foreground/80 mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                <div>
                  <p className="font-semibold text-sm">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
