import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FaqSection() {
  const faqs = [
    {
      question: "How does the AI generate habits?",
      answer:
        "Our AI analyzes your goals and creates a customized habit plan designed to help you achieve them. It considers your preferences, schedule, and past behavior to generate realistic daily habits.",
    },
    {
      question: "Is my privacy protected?",
      answer:
        "Yes, we take privacy seriously. All your data is encrypted and we never share your information with third parties. You have full control over your data.",
    },
    {
      question: "Can I change my habits after starting?",
      answer:
        "You can modify, add, or remove habits at any time. We recommend adjusting based on what's working for you.",
    },
    {
      question: "What if I miss a day?",
      answer:
        "Missing a day happens to everyone. The app helps you get back on track without judgment. We focus on consistency, not perfection.",
    },
  ]

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Questions</h2>
        <p className="text-center text-muted-foreground mb-12">
          Common questions about Routini. Ask more in our community.
        </p>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
