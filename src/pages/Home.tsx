import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight, Flame, Phone, AtSign, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCommunity } from "@/lib/storage";
import { ReportType } from "@/lib/types";
import { useMemo } from "react";

const ICONS: Record<ReportType, React.ElementType> = { sms: Phone, handle: AtSign, url: Link2 };

const Home = () => {
  const navigate = useNavigate();
  const alerts = useMemo(() => getCommunity().slice(0, 5), []);

  return (
    <div className="space-y-6 pt-2">
      <Card className="rounded-3xl border-0 bg-gradient-paprika text-accent-foreground p-6 shadow-soft overflow-hidden relative">
        <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -right-12 top-10 h-20 w-20 rounded-full bg-white/5" />
        <div className="relative flex items-start gap-4">
          <span className="relative flex h-12 w-12 shrink-0 items-center justify-center">
            <span className="absolute inline-flex h-full w-full rounded-full bg-white/30 animate-pulse-ring" />
            <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-accent">
              <ShieldCheck className="h-6 w-6" strokeWidth={2.6} />
            </span>
          </span>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider opacity-90">Protection</div>
            <div className="text-2xl font-bold leading-tight">Active</div>
            <p className="text-sm opacity-90 mt-1">BlockOff is watching for scam messages, handles and links.</p>
          </div>
        </div>
      </Card>

      <Button
        onClick={() => navigate("/scan")}
        className="w-full h-14 rounded-2xl bg-foreground text-background hover:bg-foreground/90 text-base font-semibold justify-between px-5"
      >
        <span className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5" /> Check a message
        </span>
        <ArrowRight className="h-5 w-5" />
      </Button>

      <section className="space-y-3">
        <header className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-accent" /> Trending scams
          </h2>
          <button onClick={() => navigate("/community")} className="text-xs font-medium text-accent">
            See all
          </button>
        </header>
        <div className="space-y-2">
          {alerts.map((a) => {
            const Icon = ICONS[a.type];
            return (
              <Card
                key={a.type + a.identifier}
                className="rounded-2xl p-4 border border-border shadow-card flex items-center gap-3"
              >
                <span className="h-10 w-10 shrink-0 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{a.identifier}</div>
                  <div className="text-xs text-muted-foreground">{a.count} reports</div>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider rounded-full bg-accent/10 text-accent px-2 py-1">
                  Scam
                </span>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;
