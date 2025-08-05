import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import ErrorBoundary from "./components/ErrorBoundary";
import DiagnosticInfo from "./components/DiagnosticInfo";
import ProtectedRoute from "./components/ProtectedRoute";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Macros from "./pages/Macros";
import ActivityLog from "./pages/ActivityLog";
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
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
                      <Navigation />
                      <Index />
                    </div>
                  </ProtectedRoute>
                } />
                
                <Route path="/macros" element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
                      <Navigation />
                      <Macros />
                    </div>
                  </ProtectedRoute>
                } />
                
                <Route path="/activity" element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
                      <Navigation />
                      <ActivityLog />
                    </div>
                  </ProtectedRoute>
                } />
                
                {/* Catch-all route */}
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
