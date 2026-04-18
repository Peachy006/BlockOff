import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Search, Megaphone } from "lucide-react";
import { BlockOffLogo } from "@/components/BlockOffLogo";
import { getDeviceId, setOnboarded } from "@/lib/device";

const STEPS = [
  {
    icon: Search,
    title: "Detect",
    body: "Suspicious texts, links and social handles are checked instantly against scam patterns and the BlockOff community list.",
  },
  {
    icon: ShieldCheck,
    title: "Warn",
    body: "When something looks dangerous, a clear popup appears in the middle of your screen — no easy-to-miss notifications.",
  },
  {
    icon: Megaphone,
    title: "Report",
    body: "One tap reports a scam to the community so your friends, family and other users get warned next time.",
  },
];

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const next = () => {
    if (step < STEPS.length) setStep(step + 1);
  };

  const allow = () => {
    getDeviceId();
    setOnboarded();
    navigate("/", { replace: true });
  };

  if (step === STEPS.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-between px-6 py-10 bg-background">
        <div />
        <div className="w-full max-w-md flex flex-col items-center text-center gap-5">
          <span className="relative flex h-20 w-20 items-center justify-center">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent/30 animate-pulse-ring" />
            <span className="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-paprika text-accent-foreground shadow-soft">
              <ShieldCheck className="h-10 w-10" strokeWidth={2.4} />
            </span>
          </span>
          <h1 className="text-2xl font-bold">Allow BlockOff to protect this device?</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            BlockOff will run quietly in the background, scanning suspicious messages and warning you with a centered alert
            before you can act on a scam. You can revoke this anytime in Settings.
          </p>
          <div className="text-xs text-muted-foreground rounded-xl bg-muted px-3 py-2 w-full text-left">
            We create an <strong>anonymous device ID</strong> so your reports help others — no account, no personal data.
          </div>
        </div>
        <div className="w-full max-w-md flex flex-col gap-2">
          <Button onClick={allow} className="h-12 rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90 text-base font-semibold">
            Allow
          </Button>
          <Button variant="ghost" onClick={allow} className="h-11 rounded-2xl text-muted-foreground">
            Not now
          </Button>
        </div>
      </div>
    );
  }

  const s = STEPS[step];
  const Icon = s.icon;

  return (
    <div className="min-h-screen flex flex-col px-6 py-10 bg-background">
      <BlockOffLogo size="md" />
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 max-w-md mx-auto">
        <div className="h-20 w-20 rounded-3xl bg-accent/10 text-accent flex items-center justify-center">
          <Icon className="h-10 w-10" strokeWidth={2.2} />
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">{s.title}</h1>
          <p className="text-muted-foreground leading-relaxed">{s.body}</p>
        </div>
        <div className="flex gap-1.5 mt-2">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-accent" : "w-1.5 bg-muted"}`}
            />
          ))}
        </div>
      </div>
      <Button
        onClick={next}
        className="h-12 rounded-2xl bg-foreground text-background hover:bg-foreground/90 text-base font-semibold w-full max-w-md mx-auto"
      >
        {step === STEPS.length - 1 ? "Continue" : "Next"}
      </Button>
    </div>
  );
};

export default Onboarding;
