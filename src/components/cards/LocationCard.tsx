import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin } from "lucide-react";

const TZ = process.env.NEXT_PUBLIC_MY_TIMEZONE || "America/Toronto";
const LAT = parseFloat(process.env.NEXT_PUBLIC_MY_LAT || "43.6532");
const LNG = parseFloat(process.env.NEXT_PUBLIC_MY_LNG || "-79.3832");
const CITY = process.env.NEXT_PUBLIC_MY_CITY || "Toronto";
const REGION = process.env.NEXT_PUBLIC_MY_REGION || "ON";
const COUNTRY = process.env.NEXT_PUBLIC_MY_COUNTRY || "Canada";

function CoordGrid({ lat, lng }: { lat: number; lng: number }) {
  const cx = ((lng + 180) / 360) * 100;
  const cy = ((90 - lat) / 180) * 50;

  return (
    <svg
      viewBox="0 0 100 50"
      className="w-full text-muted-foreground/25"
      style={{ height: 64 }}
      aria-hidden="true"
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <line
          key={`h${i}`}
          x1="0"
          y1={(i / 6) * 50}
          x2="100"
          y2={(i / 6) * 50}
          stroke="currentColor"
          strokeWidth="0.3"
          strokeDasharray="1.5 2.5"
        />
      ))}
      {[1, 2, 3, 4, 5].map((i) => (
        <line
          key={`v${i}`}
          x1={(i / 6) * 100}
          y1="0"
          x2={(i / 6) * 100}
          y2="50"
          stroke="currentColor"
          strokeWidth="0.3"
          strokeDasharray="1.5 2.5"
        />
      ))}
      <line
        x1={cx - 7}
        y1={cy}
        x2={cx + 7}
        y2={cy}
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.5"
      />
      <line
        x1={cx}
        y1={cy - 7}
        x2={cx}
        y2={cy + 7}
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.5"
      />
      <circle cx={cx} cy={cy} r="2.5" fill="currentColor" opacity="1" className="text-foreground" />
    </svg>
  );
}

export function LocationCard() {
  const latDeg = Math.abs(LAT).toFixed(4);
  const lngDeg = Math.abs(LNG).toFixed(4);
  const latDir = LAT >= 0 ? "N" : "S";
  const lngDir = LNG >= 0 ? "E" : "W";

  return (
    <Card className="md:col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Location
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <MapPin className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate text-sm font-medium">
            {CITY}, {REGION}
          </span>
          <Badge variant="outline" className="ml-auto shrink-0 text-xs">
            {COUNTRY}
          </Badge>
        </div>

        <CoordGrid lat={LAT} lng={LNG} />

        <Separator />

        <dl className="grid grid-cols-1 gap-1.5 font-mono text-xs">
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">LAT</dt>
            <dd className="tabular-nums">
              {latDeg}° {latDir}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">LON</dt>
            <dd className="tabular-nums">
              {lngDeg}° {lngDir}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="shrink-0 text-muted-foreground">TZ</dt>
            <dd className="truncate text-right">{TZ}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
