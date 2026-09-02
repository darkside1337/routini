export function StatsSection() {
  const stats = [
    { number: "87%", label: "Complete their habits daily" },
    { number: "42", label: "Days to form a habit" },
    { number: "91%", label: "Reach their goals within 90 days" },
  ]

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Real results from real people</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center space-y-2">
              <div className="text-5xl font-bold text-primary">{stat.number}</div>
              <p className="text-foreground/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
