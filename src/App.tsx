import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MobileShell } from "@/components/MobileShell";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import Scan from "./pages/Scan";
import Report from "./pages/Report";
import Reports from "./pages/Reports";
import Community from "./pages/Community";
import SettingsPage from "./pages/SettingsPage";

const queryClient = new QueryClient();

const ShellRoutes = () => {
  const { pathname } = useLocation();
  const bare = pathname === "/onboarding";
  const routes = (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/scan" element={<Scan />} />
      <Route path="/report" element={<Report />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/community" element={<Community />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
  return bare ? routes : <MobileShell>{routes}</MobileShell>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ShellRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
