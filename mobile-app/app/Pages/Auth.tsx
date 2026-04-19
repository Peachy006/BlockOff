import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BlockOffLogo } from "@/components/BlockOffLogo";
import { Mail, Lock, Phone, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { hasOnboarded } from "@/lib/device";
import { createUser, loginUser } from "@/lib/auth";

type Mode = "login" | "signup";

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);

  const goNext = () => {
    const destination = hasOnboarded() ? "/home" : "/onboarding";
    navigate(destination, { replace: true });
  };

  const handleModeChange = (nextMode: Mode) => {
    setMode(nextMode);
  };

  // ---------------- LOGIN ----------------
  const login = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes("@")) return toast.error("Enter a valid email");
    if (password.length < 4) return toast.error("Enter your password");

    setLoading(true);
    try {
      await loginUser(email.trim(), password);
      toast.success("Welcome back");
      goNext();
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- SIGNUP ----------------
  const signup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes("@")) return toast.error("Enter a valid email");
    if (password.length < 4) return toast.error("Password must be at least 4 characters");
    if (phone.replace(/\D/g, "").length < 7) return toast.error("Enter a valid phone number");

    setLoading(true);
    try {
      await createUser(email.trim(), phone.trim(), password);
      toast.success("Account created");
      goNext();
    } catch (err: any) {
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-3">
          <BlockOffLogo size="md" />
          <div className="text-center">
            <h1 className="text-2xl font-bold">Welcome to BlockOff</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "login"
                ? "Sign in to continue"
                : "Create your BlockOff account"}
            </p>
          </div>
        </div>

        <Card className="rounded-3xl border-border shadow-card overflow-hidden">
          {/* Toggle */}
          <div className="flex gap-1 rounded-3xl bg-muted p-1">
            <button
              type="button"
              onClick={() => handleModeChange("login")}
              className={`flex-1 rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                mode === "login"
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground"
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
                  : "text-muted-foreground"
              }`}
            >
              Sign up
            </button>
          </div>

          <div className="p-5">
            {mode === "login" ? (
              <form onSubmit={login} className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-accent" /> Email
                  </Label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-accent" /> Password
                  </Label>
                  <Input
                    type="password"
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
                  className="w-full h-12 rounded-xl bg-foreground text-background"
                >
                  {loading ? "Signing in…" : "Log in"}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </form>
            ) : (
              <form onSubmit={signup} className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-accent" /> Email
                  </Label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-accent" /> Password
                  </Label>
                  <Input
                    type="password"
                    placeholder="Choose a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-accent" /> Phone
                  </Label>
                  <Input
                    type="tel"
                    placeholder="+45 12 34 56 78"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12 rounded-xl"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-foreground text-background"
                >
                  {loading ? "Creating..." : "Create account"}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </form>
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