import { TrendingUp } from "lucide-react";

export function SignUpHero() {
  return (
    <div className="max-w-md text-center text-white">
      {/* Logo */}
      <div className="mb-8 flex justify-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <TrendingUp className="w-6 h-6 text-accent" />
          </div>
          <span className="text-2xl font-bold">Routini</span>
        </div>
      </div>

      {/* Headline */}
      <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-balance">
        Build Better Habits
      </h1>

      {/* Subheading */}
      <p className="text-lg text-white/80 leading-relaxed mb-8">
        Transform your goals into trackable daily habits. Small consistent
        actions lead to extraordinary results.
      </p>

      {/* Decorative element */}
      <div className="flex items-center justify-center gap-3 pt-4">
        <div className="w-2 h-2 rounded-full bg-accent" />
        <span className="text-sm text-white/70">Trusted by thousands</span>
        <div className="w-2 h-2 rounded-full bg-accent" />
      </div>
    </div>
  );
}
