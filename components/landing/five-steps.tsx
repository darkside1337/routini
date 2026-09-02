import { ArrowRight } from "lucide-react"

export function FiveSteps() {
  const steps = [
    { number: "1", title: "Name it", description: "Your big goal" },
    { number: "2", title: "Break it down", description: "Into daily habits" },
    { number: "3", title: "Start today", description: "Your streak begins" },
    { number: "4", title: "Check daily", description: "Stay consistent" },
    { number: "5", title: "Keep going", description: "Watch progress grow" },
  ]

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Five steps to change</h2>
        <p className="text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
          Here's how Routini transforms your goals into achievable daily wins
        </p>

        <div className="grid md:grid-cols-5 gap-4 md:gap-2">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4">
                {step.number}
              </div>
              <h3 className="font-semibold text-center">{step.title}</h3>
              <p className="text-sm text-foreground/70 text-center mt-2">{step.description}</p>
              {index < steps.length - 1 && <ArrowRight className="w-4 h-4 text-foreground/30 mt-4 md:rotate-90" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
