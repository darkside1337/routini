export function RealResults() {
  const stats = [
    {
      number: "87%",
      label: "Complete their daily habits",
      sublabel: "compared to industry avg 73%",
    },
    {
      number: "42",
      label: "Days to form a habit",
      sublabel: "Average time to consistency",
    },
    {
      number: "91%",
      label: "Reach their goals within",
      sublabel: "6 months of using Routini",
    },
  ]

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Real results from real people</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-muted/50 rounded-lg p-8 text-center space-y-3">
              <div className="text-5xl font-bold text-primary">{stat.number}</div>
              <h3 className="font-semibold text-lg">{stat.label}</h3>
              <p className="text-foreground/70 text-sm">{stat.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
