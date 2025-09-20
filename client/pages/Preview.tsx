import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/anim/Reveal";

export default function Preview() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const src = params.get("src");
  const name = params.get("name") || "uploaded.jpg";
  const type = params.get("type") || "image/jpeg";

  useEffect(() => {
    if (!src || !/image\/jpeg|image\/jpg/i.test(type)) {
      navigate("/verify", { replace: true });
    }
  }, [src, type, navigate]);

  if (!src) return null;

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(700px_circle_at_20%_10%,hsl(var(--primary)/.15),transparent_45%),radial-gradient(600px_circle_at_85%_0%,hsl(var(--accent)/.12),transparent_45%)]" />
      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <Reveal>
            <div className="rounded-2xl overflow-hidden border bg-black/40">
              <img src={src} alt={name} className="w-full h-auto object-contain" />
            </div>
          </Reveal>

          <Reveal delay={0.05} className="space-y-4">
            <h1 className="text-2xl font-semibold">Preview</h1>
            <p className="text-sm text-muted-foreground">JPEG detected. Confirm this is the correct file before continuing.</p>
            <div className="rounded-xl border p-4 text-sm">
              <div className="flex items-center justify-between"><span className="text-muted-foreground">File name</span><span className="font-medium truncate max-w-[60%]" title={name}>{name}</span></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium">{type}</span></div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="rounded-full px-6" onClick={() => navigate(`/verify?${params.toString()}`)}>Continue</Button>
              <Button size="lg" variant="secondary" className="rounded-full px-6" onClick={() => navigate("/verify")}>Choose another</Button>
              <Button size="lg" variant="ghost" className="rounded-full px-6" onClick={() => navigate(-1)}>Back</Button>
            </div>
          </Reveal>
        </div>
      </main>
    </section>
  );
}
