import Link from "next/link"

export function Footer() {
  const sections = [
    {
      title: "Product",
      links: ["Features", "Pricing", "Security", "Roadmap"],
    },
    {
      title: "Company",
      links: ["About", "Blog", "Careers", "Press"],
    },
    {
      title: "Resources",
      links: ["Documentation", "API Docs", "Community", "Support"],
    },
    {
      title: "Legal",
      links: ["Privacy", "Terms", "Cookies", "Contact"],
    },
  ]

  return (
    <footer className="bg-muted/50 border-t border-border py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-8 mb-8">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary"></div>
              <span className="font-semibold">Routini</span>
            </div>
            <p className="text-sm text-foreground/70">Turn goals into daily habits.</p>
          </div>

          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-4 text-sm">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-foreground/70">© 2025 Routini. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" />
              </svg>
            </a>
            <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
