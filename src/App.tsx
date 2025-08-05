import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import ErrorBoundary from "./components/ErrorBoundary";
import DiagnosticInfo from "./components/DiagnosticInfo";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  // Add diagnostic keyboard shortcut (Ctrl+Shift+D)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        setShowDiagnostic(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            
            {/* Diagnostic Tool */}
            <DiagnosticInfo 
              isVisible={showDiagnostic} 
              onClose={() => setShowDiagnostic(false)} 
            />
            
            {/* Diagnostic Button (only in development) */}
            {import.meta.env.DEV && (
              <button
                onClick={() => setShowDiagnostic(true)}
                className="fixed bottom-4 right-4 bg-red-600 text-white p-2 rounded-full shadow-lg z-40"
                title="Show Diagnostic Info (Ctrl+Shift+D)"
              >
                🔧
              </button>
            )}
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
