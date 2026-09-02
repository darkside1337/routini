export function BenefitsSection() {
  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Built for real people with real goals</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="text-4xl font-bold text-primary">Simplicity</div>
            <p className="text-foreground/70">
              No overwhelming dashboards or complex workflows. Just focus on your habits.
            </p>
          </div>
          <div className="space-y-4">
            <div className="text-4xl font-bold text-primary">Personalization</div>
            <p className="text-foreground/70">AI creates habits tailored to your unique goals and lifestyle.</p>
          </div>
          <div className="space-y-4">
            <div className="text-4xl font-bold text-primary">Ease of starting</div>
            <p className="text-foreground/70">Get started in minutes. No lengthy onboarding or setup required.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
