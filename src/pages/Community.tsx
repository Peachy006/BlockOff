import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Phone, AtSign, Link2, Search } from "lucide-react";
import { getCommunity, normalize } from "@/lib/storage";
import { ReportType } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICONS: Record<ReportType, React.ElementType> = { sms: Phone, handle: AtSign, url: Link2 };
const FILTERS: { value: ReportType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "sms", label: "SMS" },
  { value: "handle", label: "Handles" },
  { value: "url", label: "Links" },
];

const Community = () => {
  const [filter, setFilter] = useState<ReportType | "all">("all");
  const [q, setQ] = useState("");
  const items = useMemo(() => {
    const all = getCommunity();
    const nq = normalize(q);
    return all.filter(
      (a) => (filter === "all" || a.type === filter) && (!nq || normalize(a.identifier).includes(nq)),
    );
  }, [filter, q]);

  return (
    <div className="space-y-4 pt-2">
      <div>
        <h1 className="text-2xl font-bold">Community alerts</h1>
        <p className="text-sm text-muted-foreground">Top scams reported by BlockOff users.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search number, handle or URL"
          className="h-12 rounded-2xl pl-10 bg-card"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto -mx-1 px-1">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-xs font-medium border transition-colors",
              filter === f.value
                ? "bg-foreground text-background border-foreground"
                : "bg-card text-muted-foreground border-border",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-10">No matches.</p>
        )}
        {items.map((a) => {
          const Icon = ICONS[a.type];
          return (
            <Card key={a.type + a.identifier} className="rounded-2xl p-4 border-border shadow-card flex items-center gap-3">
              <span className="h-10 w-10 shrink-0 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{a.identifier}</div>
                <div className="text-xs text-muted-foreground">
                  {a.count} reports · {timeAgo(a.lastSeen)}
                </div>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider rounded-full bg-accent text-accent-foreground px-2 py-1">
                Scam
              </span>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

function timeAgo(ts: number): string {
  const m = Math.round((Date.now() - ts) / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

export default Community;
