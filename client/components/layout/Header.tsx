import { Link, NavLink, useLocation } from "react-router-dom";
import { ShieldCheck, ScanSearch, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    { to: "/", label: "Home" },
    { to: "/verify", label: "Verify" },
  ];

  return (
    <header className="sticky top-4 z-50 w-full">
      <div className="container mx-auto px-4">
        <div
          className={cn(
            "flex h-14 items-center justify-between rounded-full border px-4 transition-all",
            "backdrop-blur supports-[backdrop-filter]:bg-background/60",
            scrolled ? "shadow-lg/50 bg-background/70" : "shadow-sm bg-background/50",
          )}
        >
          <Link to="/" className="flex items-center gap-2">
            <div className="relative h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-fuchsia-500 flex items-center justify-center shadow-lg shadow-fuchsia-500/20">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Jharkhand Credential Trust
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  cn(
                    "text-sm transition-colors hover:text-foreground/90",
                    isActive ? "text-foreground" : "text-foreground/60",
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Button asChild variant="secondary" size="sm" className="rounded-full px-4 h-9">
              <Link to="/#how-it-works">How it works</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="gap-2 rounded-full px-4 h-9 shadow-sm hover:shadow-emerald-500/20 hover:shadow-lg"
            >
              <Link to="/verify">
                <ScanSearch className="h-4 w-4" />
                Verify now
              </Link>
            </Button>
            <AuthButtons />
          </div>

          <button
            aria-label="Toggle menu"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/60 backdrop-blur"
            onClick={() => setOpen((v) => !v)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {open && (
          <div className="md:hidden pt-2">
            <div className="flex flex-col gap-2 rounded-2xl border bg-background/70 backdrop-blur p-3 shadow-lg">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "rounded-md px-3 py-2",
                    pathname === n.to
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50",
                  )}
                  onClick={() => setOpen(false)}
                >
                  {n.label}
                </Link>
              ))}
              <Button asChild size="sm" className="gap-2 rounded-full px-4 h-9">
                <Link to="/verify" onClick={() => setOpen(false)}>
                  <ScanSearch className="h-4 w-4" /> Verify now
                </Link>
              </Button>
              <div className="pt-2">
                <AuthButtons mobile onClickItem={() => setOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function AuthButtons({
  mobile,
  onClickItem,
}: {
  mobile?: boolean;
  onClickItem?: () => void;
}) {
  const { user, signOut } = useAuth();
  if (user) {
    return (
      <div
        className={cn(
          "flex items-center gap-2",
          mobile && "flex-col items-stretch",
        )}
      >
        {user.role === "admin" && (
          <Button asChild variant="outline" size="sm" className="rounded-full px-4 h-9" onClick={onClickItem}>
            <Link to="/admin">Admin panel</Link>
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          className="rounded-full px-4 h-9"
          onClick={() => {
            void signOut();
            onClickItem?.();
          }}
        >
          Sign out
        </Button>
      </div>
    );
  }
  return (
    <Button asChild size="sm" variant="outline" className="rounded-full px-4 h-9" onClick={onClickItem}>
      <Link to="/sign-in">Sign in</Link>
    </Button>
  );
}
