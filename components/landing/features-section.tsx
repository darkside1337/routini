import { Card, CardContent } from "@/components/ui/card";

export function FeaturesSection() {
  const features = [
    {
      title: "AI generates habits from your goals",
      description:
        "Let our AI break down your big goals into actionable daily habits",
    },
    {
      title: "Daily checklists & smart tracking",
      description:
        "Check off completed habits and track your consistency over time",
    },
    {
      title: "Intelligent habit recommendations",
      description:
        "Get personalized suggestions based on your goals and progress",
    },
  ];

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          What makes Routini work
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          These tools work in synergy to keep you focused
        </p>
        <div className="grid md:grid-cols-3 gap-6 ">
          {features.map((feature, idx) => (
            <Card
              key={idx}
              className="border border-border hover:-translate-y-1 transition-all duration-300"
            >
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
