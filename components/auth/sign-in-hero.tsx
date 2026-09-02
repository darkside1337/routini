"use client"

import { LogIn, TrendingUp, Zap, Target } from "lucide-react"

export function SignInHero() {
  return (
    <div className="max-w-md text-center space-y-8">
      <div className="flex justify-center">
        <div className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/30 to-primary/15 rounded-xl flex items-center justify-center backdrop-blur-md border border-primary/20 group-hover:from-primary/50 group-hover:to-primary/30 transition-all duration-300">
            <TrendingUp className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <span className="text-3xl font-bold text-foreground">Routini</span>
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-balance text-foreground">
          Pick Up Where You
          <span className="block bg-gradient-to-r from-primary via-accent to-accent bg-clip-text text-transparent">
            Left Off
          </span>
        </h1>

        <p className="text-lg text-foreground/70 leading-relaxed max-w-sm mx-auto">
          Continue your habit-building journey and stay on track with your daily goals.
        </p>
      </div>

      <div className="space-y-3 pt-4">
        <div className="flex items-center gap-3 text-sm text-foreground/75 group">
          <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent/40 transition-colors">
            <Zap className="w-3 h-3 text-accent" />
          </div>
          <span>Access your habit dashboard</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-foreground/75 group">
          <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent/40 transition-colors">
            <Target className="w-3 h-3 text-accent" />
          </div>
          <span>Check your progress streaks</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-foreground/75 group">
          <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent/40 transition-colors">
            <LogIn className="w-3 h-3 text-accent" />
          </div>
          <span>Resume your daily routines</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 pt-6 border-t border-border">
        <div className="flex -space-x-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-accent/60 border-2 border-background" />
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary/60 border-2 border-background" />
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-secondary to-secondary/60 border-2 border-background" />
        </div>
        <span className="text-sm text-foreground/60">50K+ active users</span>
      </div>
    </div>
  )
}
