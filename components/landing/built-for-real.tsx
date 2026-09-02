export function BuiltForReal() {
  const features = [
    {
      icon: "📊",
      title: "No overwhelm",
      description: "Stop adding 10 habits at once. We prioritize one habit at a time.",
    },
    {
      icon: "👤",
      title: "Truly personal",
      description: "Your habits are unique to you and adjust based on your feedback.",
    },
    {
      icon: "⚡",
      title: "Easy to begin",
      description: "Start in less than 60 seconds with our quick-start system.",
    },
    {
      icon: "📈",
      title: "Clear progress",
      description: "See exactly where you are and track your habit streaks daily.",
    },
  ]

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Built for real people with real goals</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="text-4xl">{feature.icon}</div>
              <h3 className="font-semibold text-lg">{feature.title}</h3>
              <p className="text-foreground/70 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
