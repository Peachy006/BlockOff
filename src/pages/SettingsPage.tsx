import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RefreshCw, Info, Shield } from "lucide-react";
import { getDeviceId, regenerateDeviceId, shortDeviceId } from "@/lib/device";
import { getSettings, saveSettings } from "@/lib/storage";
import { BlockOffLogo } from "@/components/BlockOffLogo";
import { toast } from "sonner";

const SettingsPage = () => {
  const [deviceId, setDeviceId] = useState(getDeviceId());
  const [settings, setSettings] = useState(getSettings());

  const regen = () => {
    const id = regenerateDeviceId();
    setDeviceId(id);
    toast.success("New device ID generated");
  };

  const toggleShare = (v: boolean) => {
    const next = { ...settings, shareWithCommunity: v };
    setSettings(next);
    saveSettings(next);
  };

  return (
    <div className="space-y-5 pt-2">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Anonymous, by design.</p>
      </div>

      <Card className="rounded-2xl p-4 border-border shadow-card space-y-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Device ID</div>
          <div className="font-mono text-lg mt-1">{shortDeviceId(deviceId)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Your reports are linked to this random ID. No name, no number, no email.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={regen} className="rounded-xl">
          <RefreshCw className="h-4 w-4" /> Regenerate
        </Button>
      </Card>

      <Card className="rounded-2xl p-4 border-border shadow-card flex items-center justify-between gap-4">
        <div>
          <Label htmlFor="share" className="text-sm font-semibold">
            Share my reports
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Help warn other users about scams you've reported.
          </p>
        </div>
        <Switch id="share" checked={settings.shareWithCommunity} onCheckedChange={toggleShare} />
      </Card>

      <Card className="rounded-2xl p-4 border-border shadow-card space-y-3">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-accent" />
          <div className="text-sm font-semibold">About BlockOff</div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          BlockOff blocks scams before they reach you. We combine on-device pattern detection with a community list of
          known scam numbers, handles and links. When something looks dangerous, we show a centered alert so you can't
          miss it.
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
          <Shield className="h-3.5 w-3.5" /> v0.1 · Beta
        </div>
        <BlockOffLogo size="sm" className="opacity-60" />
      </Card>
    </div>
  );
};

export default SettingsPage;
