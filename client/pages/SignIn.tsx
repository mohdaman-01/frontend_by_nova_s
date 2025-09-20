import { Button } from "@/components/ui/button";
import { ShieldCheck, LogIn, UserCog, AlertCircle, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SignIn() {
  const { signInWithGoogle, backendConnected } = useAuth();

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="rounded-2xl border p-8 bg-card">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-emerald-500 text-primary-foreground flex items-center justify-center mb-4">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Sign in</h1>
          <p className="text-sm text-muted-foreground mb-4">
            Continue with Google to verify certificates or manage the registry.
          </p>

          {!backendConnected && (
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Backend OAuth not configured. Using demo authentication for testing.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-3">
            <Button
              onClick={() => signInWithGoogle("user")}
              className="w-full gap-2"
            >
              <LogIn className="h-4 w-4" /> 
              {backendConnected ? "Continue with Google" : "Demo Sign In"}
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Sign in to verify certificates and access your verification history.
          </p>
        </div>
      </div>
    </main>
  );
}
