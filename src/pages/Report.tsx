import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Phone, AtSign, Link2 } from "lucide-react";
import { ReportType } from "@/lib/types";
import { saveReport } from "@/lib/storage";
import { getDeviceId } from "@/lib/device";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const TYPES: { value: ReportType; label: string; icon: React.ElementType }[] = [
  { value: "sms", label: "SMS / Phone", icon: Phone },
  { value: "handle", label: "Social handle", icon: AtSign },
  { value: "url", label: "URL / Link", icon: Link2 },
];

const Report = () => {
  const location = useLocation() as { state?: { type?: ReportType; identifier?: string } };
  const navigate = useNavigate();
  const [type, setType] = useState<ReportType>(location.state?.type ?? "sms");
  const [identifier, setIdentifier] = useState(location.state?.identifier ?? "");
  const [excerpt, setExcerpt] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (location.state?.identifier && location.state.identifier.length > 80) {
      setExcerpt(location.state.identifier);
      setIdentifier("");
    }
  }, [location.state]);

  const submit = () => {
    if (!identifier.trim()) {
      toast.error("Please enter the number, handle or link.");
      return;
    }
    saveReport({
      id: crypto.randomUUID(),
      deviceId: getDeviceId(),
      type,
      identifier: identifier.trim(),
      excerpt: excerpt.trim() || undefined,
      createdAt: Date.now(),
    });
    setDone(true);
  };

  if (done) {
    return (
      <div className="pt-10 flex flex-col items-center text-center gap-5 animate-fade-up">
        <div className="h-20 w-20 rounded-full bg-accent/15 flex items-center justify-center text-accent">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Thank you</h1>
          <p className="text-muted-foreground mt-1 text-sm max-w-xs mx-auto">
            Your report is now part of the BlockOff community list. Other users will be warned automatically.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Button
            onClick={() => navigate("/reports")}
            className="h-12 rounded-2xl bg-foreground text-background hover:bg-foreground/90"
          >
            See my reports
          </Button>
          <Button variant="ghost" onClick={() => navigate("/")} className="h-11 rounded-2xl">
            Back to home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pt-2">
      <div>
        <h1 className="text-2xl font-bold">Report a scam</h1>
        <p className="text-sm text-muted-foreground">Help others avoid this one.</p>
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Type</Label>
        <div className="grid grid-cols-3 gap-2">
          {TYPES.map((t) => {
            const Icon = t.icon;
            const isActive = type === t.value;
            return (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                className={cn(
                  "rounded-2xl py-3 text-xs font-medium border flex flex-col items-center gap-1 transition-all",
                  isActive
                    ? "bg-foreground text-background border-foreground shadow-card"
                    : "bg-card text-muted-foreground border-border",
                )}
              >
                <Icon className="h-4 w-4" />
                {t.label.split(" ")[0]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ident" className="text-xs uppercase tracking-wider text-muted-foreground">
          {type === "sms" ? "Phone number" : type === "handle" ? "Handle" : "URL"}
        </Label>
        <Input
          id="ident"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder={type === "sms" ? "+47 900 12 345" : type === "handle" ? "@suspicious_user" : "https://..."}
          className="h-12 rounded-2xl bg-card"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt" className="text-xs uppercase tracking-wider text-muted-foreground">
          Message excerpt <span className="normal-case text-muted-foreground/60">(optional)</span>
        </Label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={4}
          placeholder="Paste the message you received..."
          className="rounded-2xl bg-card resize-none"
        />
      </div>

      <Button
        onClick={submit}
        className="w-full h-12 rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
      >
        Submit report
      </Button>
    </div>
  );
};

export default Report;
