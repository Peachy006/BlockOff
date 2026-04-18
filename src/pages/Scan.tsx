import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Phone, AtSign, Link2, Sparkles } from "lucide-react";
import { ReportType } from "@/lib/types";
import { classify } from "@/lib/detect";
import { BlockOffAlert } from "@/components/BlockOffAlert";
import { cn } from "@/lib/utils";

const TYPES: { value: ReportType; label: string; icon: React.ElementType; placeholder: string }[] = [
  { value: "sms", label: "SMS", icon: Phone, placeholder: "Paste the message or phone number..." },
  { value: "handle", label: "Handle", icon: AtSign, placeholder: "@username on IG, Messenger, WhatsApp..." },
  { value: "url", label: "Link", icon: Link2, placeholder: "https://..." },
];

const Scan = () => {
  const [type, setType] = useState<ReportType>("sms");
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const result = text.trim() ? classify(text, type) : null;
  const active = TYPES.find((t) => t.value === type)!;

  const tryDemo = () => {
    setType("sms");
    setText("URGENT: Your DHL pakke is held at customs. Pay the fee here: http://bit.ly/dhl-redeliv3ry");
  };

  const onCheck = () => {
    if (!text.trim()) return;
    setOpen(true);
  };

  const onReport = () => {
    navigate("/report", { state: { type, identifier: text } });
  };

  return (
    <div className="space-y-5 pt-2">
      <div>
        <h1 className="text-2xl font-bold">Check a message</h1>
        <p className="text-sm text-muted-foreground">Paste anything suspicious — we'll analyze it instantly.</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {TYPES.map((t) => {
          const Icon = t.icon;
          const isActive = type === t.value;
          return (
            <button
              key={t.value}
              onClick={() => setType(t.value)}
              className={cn(
                "rounded-2xl py-3 px-2 text-xs font-medium border flex flex-col items-center gap-1 transition-all",
                isActive
                  ? "bg-foreground text-background border-foreground shadow-card"
                  : "bg-card text-muted-foreground border-border",
              )}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      <Card className="rounded-2xl p-3 border-border shadow-card">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={active.placeholder}
          rows={5}
          className="border-0 focus-visible:ring-0 resize-none bg-transparent text-base p-2"
        />
      </Card>

      <div className="flex gap-2">
        <Button
          onClick={onCheck}
          disabled={!text.trim()}
          className="flex-1 h-12 rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
        >
          <Sparkles className="h-4 w-4" /> Analyze
        </Button>
        <Button onClick={tryDemo} variant="outline" className="h-12 rounded-2xl">
          Demo
        </Button>
      </div>

      {result && (
        <Card className="rounded-2xl p-4 border-border shadow-card space-y-3 animate-fade-up">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live preview</span>
            <span className="text-xs text-muted-foreground">Severity {result.severity}/100</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full transition-all",
                result.verdict === "safe" ? "bg-emerald-500" : "bg-accent",
              )}
              style={{ width: `${Math.max(6, result.severity)}%` }}
            />
          </div>
          {result.communityMatches > 0 && (
            <div className="text-sm text-accent font-medium">
              ⚠️ Reported by {result.communityMatches} other user{result.communityMatches === 1 ? "" : "s"}.
            </div>
          )}
        </Card>
      )}

      {result && (
        <BlockOffAlert
          open={open}
          onOpenChange={setOpen}
          excerpt={text}
          result={result}
          onReport={onReport}
        />
      )}
    </div>
  );
};

export default Scan;
