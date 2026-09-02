import { Card, CardContent } from "@/components/ui/card";

export function HowItWorksSection() {
  const steps = [
    {
      number: "Step 1",
      title: "Set a goal",
      description: "Define what you want to achieve",
    },
    {
      number: "Step 2",
      title: "Break it down",
      description: "We break it into daily habits",
    },
    {
      number: "Step 3",
      title: "Start tracking",
      description: "Check off habits daily",
    },
    {
      number: "Step 4",
      title: "See progress",
      description: "Watch your consistency grow",
    },
    {
      number: "Step 5",
      title: "Adjust as needed",
      description: "Refine habits based on results",
    },
    {
      number: "Step 6",
      title: "Keep going",
      description: "Build momentum toward success",
    },
  ];

  return (
    <section
      className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30"
      id="how-it-works"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Five steps to change
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          We break everything down so nothing feels overwhelming
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <Card key={idx} className="border border-border">
              <CardContent className="pt-6">
                <div className="text-sm text-primary font-semibold mb-2">
                  {step.number}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
