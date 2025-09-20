import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Verify from "./pages/Verify";
import SignIn from "./pages/SignIn";
import Admin from "./pages/Admin";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToHash from "@/components/ScrollToHash";
import FloatingThemeToggle from "@/components/FloatingThemeToggle";
import Preview from "./pages/Preview";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/preview" element={<Preview />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <Admin />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          {/* Ensure hash links like /#how-it-works scroll correctly */}
          <ScrollToHash />
          {/* Theme toggle FAB */}
          <FloatingThemeToggle />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

const container = document.getElementById("root")!;
const existingRoot = (window as any).__APP_ROOT__;
if (existingRoot) {
  existingRoot.render(<App />);
} else {
  const root = createRoot(container);
  (window as any).__APP_ROOT__ = root;
  root.render(<App />);
}
