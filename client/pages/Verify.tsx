import UploadBox from "@/components/UploadBox";
import Reveal from "@/components/anim/Reveal";

import HeroOrb from "@/components/three/Orb";

export default function Verify() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(700px_circle_at_20%_10%,hsl(var(--primary)/.15),transparent_45%),radial-gradient(600px_circle_at_85%_0%,hsl(var(--accent)/.12),transparent_45%)]" />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto space-y-8">
          <Reveal className="space-y-3 text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Verify a certificate
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Upload a certificate to validate its authenticity using AI-driven
              checks, OCR, QR decoding, and cryptographic hashes against
              institutional registries.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="relative">
              <div className="absolute -inset-4 -z-10 rounded-2xl bg-gradient-to-br from-primary/20 to-fuchsia-500/20 blur-2xl animate-gradient-x" />
              <div className="pointer-events-none absolute -z-10 -top-16 -right-16 h-64 w-64">
                <HeroOrb />
              </div>
              <UploadBox />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="text-center">
            <p className="text-xs text-muted-foreground">
              We never store your file. All verification runs locally, with
              optional server validation when institutions are connected.
            </p>
          </Reveal>
        </div>
      </main>
    </section>
  );
}
