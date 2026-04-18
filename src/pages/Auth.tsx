import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { BlockOffLogo } from "@/components/BlockOffLogo";
import { Mail, Lock, Phone, ArrowRight, ArrowLeft, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { hasOnboarded } from "@/lib/device";
import { setAuthed } from "@/lib/auth";

type Step = "email" | "code" | "phone";
type Mode = "login" | "signup";

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const goNext = () => {
    const destination = hasOnboarded() ? "/home" : "/onboarding";
    navigate(destination, { replace: true });
  };

  const resetSignup = () => {
    setStep("email");
    setCode("");
    setPhone("");
  };

  const handleModeChange = (nextMode: Mode) => {
    setMode(nextMode);
    if (nextMode === "signup") resetSignup();
  };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return toast.error("Enter a valid email");
    if (password.length < 4) return toast.error("Enter your password");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAuthed(true);
      toast.success("Welcome back");
      goNext();
    }, 600);
  };

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return toast.error("Enter a valid email");
    setLoading(true);
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
    setTimeout(() => {
      setLoading(false);
      setStep("phone");
    }, 600);
  };

  const savePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\D/g, "").length < 7) return toast.error("Enter a valid phone");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAuthed(true);
      toast.success("Welcome to BlockOff");
      goNext();
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
              {mode === "login" ? "Sign in to continue" : "Create your BlockOff account"}
            </p>
          </div>
        </div>

        <Card className="rounded-3xl border-border shadow-card overflow-hidden">
          <div className="flex gap-1 rounded-3xl bg-muted p-1">
            <button
              type="button"
              onClick={() => handleModeChange("login")}
              className={`flex-1 rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                mode === "login"
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("signup")}
              className={`flex-1 rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                mode === "signup"
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign up
            </button>
          </div>

          <div className="p-5">
            {mode === "login" ? (
              <form onSubmit={login} className="space-y-4">
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
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold">
                    <Lock className="h-4 w-4 text-accent" /> Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-xl"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-semibold justify-between px-5"
                >
                  <span>{loading ? "Signing in…" : "Log in"}</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  New here? Tap "Sign up" to create an account.
                </p>
              </form>
            ) : (
              <div className="space-y-4">
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
              </div>
            )}
          </div>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          By continuing you agree to BlockOff's terms & privacy.
        </p>
      </div>
    </div>
  );
};

export default Auth;
