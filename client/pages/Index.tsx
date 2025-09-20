import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  QrCode,
  Fingerprint,
  FileText,
  BrainCircuit,
  Network,
  BadgeCheck,
  LogIn,
} from "lucide-react";
import UploadBox from "@/components/UploadBox";
import Reveal from "@/components/anim/Reveal";
import HeroOrb from "@/components/three/Orb";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Index() {
  const { user, signInWithGoogle, loading } = useAuth();
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  useEffect(() => {
    // Show sign-in prompt after a short delay if user is not signed in
    if (!loading && !user) {
      const timer = setTimeout(() => {
        setShowSignInPrompt(true);
      }, 2000); // Show after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [user, loading]);

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(700px_circle_at_15%_20%,hsl(var(--primary)/.15),transparent_45%),radial-gradient(600px_circle_at_85%_10%,hsl(var(--accent)/.12),transparent_45%)]" />
        <div className="pointer-events-none absolute -z-10 left-1/2 top-12 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-br from-fuchsia-500/20 to-violet-600/20 blur-3xl animate-float" />
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <Reveal className="space-y-6">
              <span className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                Public credential verification for Jharkhand
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                Detect fake certificates with AI, OCR and cryptography
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl">
                Upload degrees or mark-sheets for instant validation. We analyze
                QR codes, signatures, and immutable hashes, and cross-check with
                institutional registries.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="gap-2" asChild>
                  <a href="/verify">
                    <ShieldCheck className="h-5 w-5" /> Verify a certificate
                  </a>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <a href="#how-it-works">How it works</a>
                </Button>
              </div>
              
              {/* Sign-in prompt for new users */}
              {showSignInPrompt && !user && (
                <Alert className="border-primary/20 bg-primary/5">
                  <LogIn className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span>Sign in to save your verification history and access advanced features.</span>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        signInWithGoogle();
                        setShowSignInPrompt(false);
                      }}
                      className="ml-4"
                    >
                      Sign In
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
              <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-fuchsia-400" /> Employers
                </div>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-fuchsia-400" /> Admissions
                </div>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-fuchsia-400" /> Govt
                  agencies
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="relative">
              <div className="absolute -inset-4 -z-10 rounded-2xl bg-gradient-to-br from-primary/20 to-fuchsia-500/20 blur-2xl animate-gradient-x" />
              <div className="pointer-events-none absolute -z-10 -top-12 -right-10 h-72 w-72">
                <HeroOrb />
              </div>
              <UploadBox />
            </Reveal>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="container mx-auto px-4 py-16 md:py-24"
      >
        <Reveal className="text-center space-y-3 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            How it works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Modern verification pipeline handles both legacy paper certificates
            and new ERP-generated credentials.
          </p>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          <Reveal>
            <Step icon={<FileText className="h-6 w-6" />} title="Upload">
              PDF or image. We compute a SHA-256 hash and extract basic
              metadata.
            </Step>
          </Reveal>
          <Reveal delay={0.05}>
            <Step icon={<QrCode className="h-6 w-6" />} title="Analyze">
              AI/OCR reads fields, decodes QR, and detects tampering or cloning.
            </Step>
          </Reveal>
          <Reveal delay={0.1}>
            <Step icon={<Fingerprint className="h-6 w-6" />} title="Verify">
              Cross-check with institutional registries and cryptographic
              signatures.
            </Step>
          </Reveal>
        </div>
      </section>

      {/* Detection capabilities */}
      <section className="container mx-auto px-4 pb-24">
        <div className="rounded-2xl border bg-card p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <Reveal className="space-y-4">
              <h3 className="text-2xl font-semibold">
                Detect anomalies automatically
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <Feature>Forged seals or signatures</Feature>
                <Feature>Tampered grades or photos</Feature>
                <Feature>Invalid certificate numbers</Feature>
                <Feature>Non-existent institutions or courses</Feature>
                <Feature>Duplicate or cloned documents</Feature>
                <Feature>Legacy + ERP compatibility</Feature>
              </ul>
            </Reveal>
            <Reveal delay={0.1} className="grid grid-cols-2 gap-4">
              <Stat
                icon={<BrainCircuit className="h-5 w-5" />}
                label="AI + OCR"
                value="Smart extraction"
              />
              <Stat
                icon={<QrCode className="h-5 w-5" />}
                label="QR decoding"
                value="Instant reads"
              />
              <Stat
                icon={<ShieldCheck className="h-5 w-5" />}
                label="Crypto hashes"
                value="Tamper-evident"
              />
              <Stat
                icon={<Network className="h-5 w-5" />}
                label="Registries"
                value="Institution-backed"
              />
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}

function Step({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border p-6 bg-card">
      <div className="h-10 w-10 rounded-md bg-gradient-to-br from-primary to-emerald-500 text-primary-foreground flex items-center justify-center mb-4">
        {icon}
      </div>
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2 rounded-md border p-3">
      <ShieldCheck className="h-4 w-4 text-emerald-600" />
      <span>{children}</span>
    </li>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border p-5 bg-muted/20">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        {icon} {label}
      </div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
