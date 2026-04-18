import { NavLink, useLocation } from "react-router-dom";
import { Home, Search, FileText, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlockOffLogo } from "./BlockOffLogo";

const TABS = [
  { to: "/home", icon: Home, label: "Home", end: true },
  { to: "/scan", icon: Search, label: "Scan" },
  { to: "/reports", icon: FileText, label: "Reports" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export const MobileShell = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const showHeader = pathname !== "/onboarding";

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-md flex flex-col min-h-screen relative">
        {showHeader && (
          <header className="px-5 pt-5 pb-3 flex items-center justify-between sticky top-0 bg-background/85 backdrop-blur z-30">
            <BlockOffLogo size="md" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground rounded-full bg-muted px-2 py-1">
              Beta
            </span>
          </header>
        )}

        <main className="flex-1 px-5 pb-28 animate-fade-up">{children}</main>

        {showHeader && (
          <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none">
            <div className="pointer-events-auto mb-3 mx-3 w-full max-w-md rounded-2xl bg-card shadow-soft border border-border px-2 py-1.5 flex items-center justify-between">
              {TABS.map(({ to, icon: Icon, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      "flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl text-[10px] font-medium transition-colors",
                      isActive
                        ? "text-accent bg-accent/10"
                        : "text-muted-foreground hover:text-foreground",
                    )
                  }
                >
                  <Icon className="h-5 w-5" strokeWidth={2.2} />
                  {label}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
};
