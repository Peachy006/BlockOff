import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, AtSign, Link2, Share2, Plus, FileText } from "lucide-react";
import { getReports, findCommunity } from "@/lib/storage";
import { ReportType } from "@/lib/types";
import { toast } from "sonner";

const ICONS: Record<ReportType, React.ElementType> = { sms: Phone, handle: AtSign, url: Link2 };

const Reports = () => {
  const navigate = useNavigate();
  const [, setTick] = useState(0);
  const reports = useMemo(() => getReports(), []);

  const share = async (identifier: string) => {
    const text = `⚠️ Flagged on BlockOff — avoid ${identifier}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "BlockOff scam alert", text });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    }
    setTick((t) => t + 1);
  };

  if (reports.length === 0) {
    return (
      <div className="pt-12 flex flex-col items-center text-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
          <FileText className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-xl font-bold">No reports yet</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            When you report a scam it will show up here so you can share it with friends and family.
          </p>
        </div>
        <Button onClick={() => navigate("/report")} className="rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="h-4 w-4" /> Report a scam
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pt-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My reports</h1>
          <p className="text-sm text-muted-foreground">{reports.length} total</p>
        </div>
        <Button
          size="sm"
          onClick={() => navigate("/report")}
          className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Plus className="h-4 w-4" /> New
        </Button>
      </div>

      <div className="space-y-2">
        {reports.map((r) => {
          const Icon = ICONS[r.type];
          const community = findCommunity(r.identifier, r.type);
          const reach = community ? community.count : 1;
          return (
            <Card key={r.id} className="rounded-2xl p-4 border-border shadow-card space-y-3">
              <div className="flex items-start gap-3">
                <span className="h-10 w-10 shrink-0 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold truncate">{r.identifier}</div>
                  {r.excerpt && (
                    <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">"{r.excerpt}"</div>
                  )}
                  <div className="text-[11px] text-muted-foreground mt-1">
                    {new Date(r.createdAt).toLocaleDateString()} · Helped {reach} {reach === 1 ? "person" : "people"}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Reports;
