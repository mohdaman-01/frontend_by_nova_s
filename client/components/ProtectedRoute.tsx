import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactElement;
  role?: "admin" | "user";
}) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading)
    return (
      <div className="py-24 text-center text-muted-foreground">Loading…</div>
    );
  if (!user)
    return (
      <Navigate to="/sign-in" replace state={{ from: location.pathname }} />
    );
  if (role && user.role !== role)
    return (
      <main className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold mb-2">Access denied</h1>
        <p className="text-muted-foreground">
          You don’t have permission to view this page.
        </p>
      </main>
    );
  return children;
}
