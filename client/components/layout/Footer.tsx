import { Link } from "react-router-dom";
import { ShieldCheck, Github, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/60 mt-16">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Jharkhand Credential Trust</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            Public platform for authenticating degrees and certificates across
            Jharkhand using AI, OCR and cryptographic verification.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">Platform</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/verify" className="hover:underline">
                Verify a certificate
              </Link>
            </li>
            <li>
              <Link to="/#how-it-works" className="hover:underline">
                How it works
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <a href="mailto:support@example.com" className="hover:underline">
                support@example.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              <a href="#" className="hover:underline">
                Contribute
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Jharkhand Credential Trust. All rights
        reserved.
      </div>
    </footer>
  );
}
