import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { BlockOffLogo } from "@/components/BlockOffLogo";
import { Mail, KeyRound, Phone, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {setAuthed} from "@/lib/auth";

type Step = "email" | "code" | "phone";

const Auth = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return toast.error("Enter a valid email");
    setLoading(true);
    // TODO: call backend → send verification code to email
    setTimeout(() => {
      setLoading(false);
      setStep("code");
      toast.success("Code sent to " + email);
    }, 600);
  };

  const confirmCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return toast.error("Enter the 6-digit code");
    setLoading(true);
    // TODO: call backend → verify code
    setTimeout(() => {
      setLoading(false);
      setStep("phone");
    }, 600);
  };

  const savePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\D/g, "").length < 7) return toast.error("Enter a valid phone");
    setLoading(true);
    // TODO: call backend → save phone, finish signup/login
    setTimeout(() => {
      setLoading(false);
      setAuthed(true);
      toast.success("Welcome to BlockOff");
      navigate("/", { replace: true });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-3">
          <BlockOffLogo size="md" />
          <div className="text-center">
            <h1 className="text-2xl font-bold">Welcome to BlockOff</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {step === "email" && "Sign in or create your account"}
              {step === "code" && "Check your email for the 6-digit code"}
              {step === "phone" && "Add your phone to finish"}
            </p>
          </div>
        </div>

        <Card className="rounded-2xl p-5 border-border shadow-card">
          {step === "email" && (
            <form onSubmit={sendCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold">
                  <Mail className="h-4 w-4 text-accent" /> Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-semibold justify-between px-5"
              >
                <span>{loading ? "Sending…" : "Send code"}</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </form>
          )}

          {step === "code" && (
            <form onSubmit={confirmCode} className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-semibold">
                  <KeyRound className="h-4 w-4 text-accent" /> Verification code
                </Label>
                <div className="flex justify-center pt-1">
                  <InputOTP maxLength={6} value={code} onChange={setCode}>
                    <InputOTPGroup>
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot key={i} index={i} className="h-12 w-10 text-base" />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Sent to <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("email")}
                  className="h-12 rounded-xl"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-12 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-semibold justify-between px-5"
                >
                  <span>{loading ? "Checking…" : "Confirm code"}</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </form>
          )}

          {step === "phone" && (
            <form onSubmit={savePhone} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-semibold">
                  <Phone className="h-4 w-4 text-accent" /> Phone number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+1 555 000 1234"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12 rounded-xl"
                  required
                />
                <p className="text-xs text-muted-foreground">Used to detect scam SMS sent to you.</p>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-semibold justify-between px-5"
              >
                <span>{loading ? "Saving…" : "Finish"}</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </form>
          )}
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          By continuing you agree to BlockOff's terms & privacy.
        </p>
      </div>
    </div>
  );
};

export default Auth;
