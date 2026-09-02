import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQ() {
  const faqs = [
    {
      question: "How does the habit generation work?",
      answer:
        "Our AI analyzes your goal and creates a personalized set of daily micro-habits that build up to achieving your bigger objective. Each habit is designed to be completable in under 5 minutes.",
    },
    {
      question: "Is my data private?",
      answer:
        "Yes, we take privacy seriously. Your goal data is encrypted and never sold to third parties. You have full control over what data we collect.",
    },
    {
      question: "Can I change my habits?",
      answer:
        "Absolutely. You can modify, replace, or remove habits at any time. Routini learns from your feedback to provide better recommendations.",
    },
    {
      question: "What if I miss a day?",
      answer:
        "Missing a day won't reset your progress completely. We use a lenient streak system that allows for occasional misses while keeping you accountable.",
    },
    {
      question: "How long does it take to see results?",
      answer:
        "Most users report noticing positive changes within 2-3 weeks. Research shows it takes about 42 days to form a new habit, and Routini helps you get there.",
    },
    {
      question: "Need more help?",
      answer:
        "Check out our help center or contact our support team at support@routini.com. We're here to help you succeed.",
    },
  ]

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Questions</h2>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-semibold hover:text-primary">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-foreground/70 leading-relaxed">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
