import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShieldCheck, ShieldAlert } from "lucide-react";
import { ClassifyResult, Verdict } from "@/lib/types";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  excerpt: string;
  result: ClassifyResult;
  onReport?: () => void;
}

const VERDICT_META: Record<Verdict, { label: string; icon: React.ElementType; tone: string; chip: string }> = {
  safe: { label: "Looks safe", icon: ShieldCheck, tone: "text-emerald-700", chip: "bg-emerald-100 text-emerald-800" },
  suspicious: { label: "Suspicious", icon: ShieldAlert, tone: "text-accent", chip: "bg-accent/15 text-accent" },
  scam: { label: "Likely scam", icon: AlertTriangle, tone: "text-accent", chip: "bg-accent text-accent-foreground" },
};

export const BlockOffAlert = ({ open, onOpenChange, excerpt, result, onReport }: Props) => {
  const meta = VERDICT_META[result.verdict];
  const Icon = meta.icon;
  const isDanger = result.verdict !== "safe";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-3xl p-0 overflow-hidden border-0 shadow-soft">
        <div className={`px-6 pt-6 pb-4 ${isDanger ? "bg-gradient-paprika text-accent-foreground" : "bg-muted"}`}>
          <DialogHeader className="space-y-2 text-left">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-90">
              <Icon className="h-4 w-4" /> BlockOff Alert
            </div>
            <DialogTitle className={`text-2xl font-bold ${isDanger ? "text-accent-foreground" : "text-foreground"}`}>
              {meta.label}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-3 h-2 w-full rounded-full bg-black/15 overflow-hidden">
            <div
              className="h-full bg-white/90 transition-all"
              style={{ width: `${Math.max(6, result.severity)}%` }}
            />
          </div>
          <div className={`mt-1 text-xs ${isDanger ? "text-accent-foreground/80" : "text-muted-foreground"}`}>
            Severity {result.severity}/100
          </div>
        </div>

        <div className="px-6 py-5 space-y-4 bg-card">
          {excerpt && (
            <blockquote className="text-sm rounded-xl bg-muted px-3 py-2 text-muted-foreground border-l-2 border-accent line-clamp-4">
              {excerpt}
            </blockquote>
          )}

          {result.reasons.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Why
              </div>
              <ul className="space-y-1.5">
                {result.reasons.map((r, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.indicators.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {result.indicators.slice(0, 5).map((i, idx) => (
                <span key={idx} className="text-xs rounded-full bg-muted px-2 py-1 text-muted-foreground">
                  {i}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => onOpenChange(false)}>
              Dismiss
            </Button>
            {isDanger && onReport && (
              <Button
                className="flex-1 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => {
                  onReport();
                  onOpenChange(false);
                }}
              >
                Report
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
