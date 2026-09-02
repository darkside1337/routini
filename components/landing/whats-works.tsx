export function WhatsWorks() {
  const features = [
    {
      title: "AI generates habits from your goals",
      description: "Just tell us your goal and watch as our AI generates the perfect daily habits to get you there.",
      bgColor: "bg-foreground/90",
    },
    {
      title: "We notify you of your goals",
      description: "Never miss a day with our smart reminders that keep you on track without being annoying.",
      bgColor: "bg-primary",
    },
    {
      title: "We educate you as you progress",
      description: "Learn the science behind habit formation and get personalized tips along the way.",
      bgColor: "bg-foreground/60",
    },
  ]

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What makes Routini work</h2>
          <p className="text-foreground/70 text-lg">From goals into daily tasks</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${feature.bgColor} text-white p-8 rounded-lg space-y-4 hover:shadow-lg transition-shadow`}
            >
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-white/90 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
