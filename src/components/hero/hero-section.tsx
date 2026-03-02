export function HeroSection() {
  return (
    <section className="py-16 md:py-24">
      {/* Dark: military style */}
      <p className="hidden dark:block font-mono text-[0.6rem] tracking-[0.3em] uppercase text-muted-foreground mb-2">
        Signal Detected
      </p>

      {/* Light: original gradient */}
      <h1 className="dark:hidden text-4xl md:text-5xl font-bold bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">
        Pulse Log
      </h1>
      {/* Dark: military mono */}
      <h1 className="hidden dark:block briefing-flicker font-mono text-4xl md:text-5xl font-bold tracking-wider uppercase text-foreground">
        Pulse Log
      </h1>

      <p className="mt-4 text-base dark:text-lg text-muted-foreground max-w-lg leading-relaxed">
        개발의 맥박을 기록하다. 코드, 경험, 성장에 대한 기록을 담는 공간입니다.
      </p>
    </section>
  )
}
