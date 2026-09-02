import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
              Z
            </div>
            <span className="font-semibold text-lg">Zage</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
              Case studies
            </Link>
            <Link href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
              Resources
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/signin">
              <Button variant="ghost" className="text-sm">
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="text-sm bg-primary hover:bg-primary/90">Get started</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
