import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Info, Shield } from "lucide-react";
import { getDeviceId, shortDeviceId } from "@/lib/device";
import { BlockOffLogo } from "@/components/BlockOffLogo";

const SettingsPage = () => {
  const [deviceId, setDeviceId] = useState(getDeviceId());

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
