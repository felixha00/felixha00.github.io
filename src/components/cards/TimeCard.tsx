"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Clock } from "@/components/Clock";
import { LiveDot } from "@/components/cards/LiveDot";
import { CardWatermark } from "@/components/cards/CardWatermark";
import { Clock as ClockIcon } from "lucide-react";

const SYNODIC_DAYS = 29.53058867;

const TZ = process.env.NEXT_PUBLIC_MY_TIMEZONE || "America/Toronto";
const LAT = parseFloat(process.env.NEXT_PUBLIC_MY_LAT || "43.6532");
const LNG = parseFloat(process.env.NEXT_PUBLIC_MY_LNG || "-79.3832");

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

type TimeExtra = {
  dayOfWeek: string;
  dateStr: string;
  epoch: number;
  utcOffset: string;
  tzAbbr: string;
};

type SunTimes = {
  sunrise: string;
  sunset: string;
  dayLengthStr: string;
  sunrisePct: number;
  sunsetPct: number;
};

type SolarLive = {
  elevation: number;
  nowPct: number;
};

type MoonData = {
  fraction: number;
  illumination: number;
  phaseName: string;
};

type Solstice = {
  date: Date;
  name: string;
};

// ── pure calculations ────────────────────────────────────────────────────────

function computeOffsetMinutes(tz: string, date: Date): number {
  try {
    const utcMs = new Date(date.toLocaleString("en-US", { timeZone: "UTC" })).getTime();
    const tzMs = new Date(date.toLocaleString("en-US", { timeZone: tz })).getTime();
    return Math.round((tzMs - utcMs) / 60000);
  } catch {
    return 0;
  }
}

function computeUtcOffset(tz: string): string {
  try {
    const diffMin = computeOffsetMinutes(tz, new Date());
    const sign = diffMin >= 0 ? "+" : "-";
    const abs = Math.abs(diffMin);
    const h = String(Math.floor(abs / 60)).padStart(2, "0");
    const m = String(abs % 60).padStart(2, "0");
    return `UTC${sign}${h}:${m}`;
  } catch {
    return "UTC";
  }
}

function formatOffsetDelta(deltaMin: number): string {
  const sign = deltaMin >= 0 ? "+" : "-";
  const abs = Math.abs(deltaMin);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `${sign}${h}H${m ? `${m}M` : ""}`;
}

function describeOffsetDelta(deltaMin: number): string {
  const abs = Math.abs(deltaMin);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const dur = `${h}h${m ? ` ${m}m` : ""}`;
  return `Felix is ${dur} ${deltaMin >= 0 ? "ahead of" : "behind"} you`;
}

function formatClockHHMM(tz: string, date: Date): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  } catch {
    return "--:--";
  }
}

// Low-precision Meeus solstice formula (valid 1000–3000 CE, accurate to within a day).
function solsticeJDE(year: number, solstice: "june" | "december"): number {
  const Y = (year - 2000) / 1000;
  if (solstice === "june") {
    return 2451716.56767 + 365241.62603 * Y + 0.00325 * Y ** 2 + 0.00888 * Y ** 3 - 0.0003 * Y ** 4;
  }
  return 2451900.05952 + 365242.74049 * Y - 0.06223 * Y ** 2 - 0.00823 * Y ** 3 + 0.00032 * Y ** 4;
}

function jdeToDate(jde: number): Date {
  return new Date((jde - 2440587.5) * 86400000);
}

function nextSolstice(now: Date, isNorthernHemisphere: boolean): Solstice {
  const year = now.getUTCFullYear();
  const candidates: { date: Date; month: "june" | "december" }[] = [
    { date: jdeToDate(solsticeJDE(year, "june")), month: "june" },
    { date: jdeToDate(solsticeJDE(year, "december")), month: "december" },
    { date: jdeToDate(solsticeJDE(year + 1, "june")), month: "june" },
  ];
  const next = candidates.find((c) => c.date.getTime() > now.getTime()) ?? candidates[candidates.length - 1]!;
  const isSummer = isNorthernHemisphere ? next.month === "june" : next.month === "december";
  return { date: next.date, name: isSummer ? "Summer Solstice" : "Winter Solstice" };
}

function computeTzAbbr(tz: string): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "short",
    }).formatToParts(new Date());
    return parts.find((p) => p.type === "timeZoneName")?.value ?? tz;
  } catch {
    return tz;
  }
}

function getMoonPhase(date: Date): MoonData {
  const JD = date.getTime() / 86400000 + 2440587.5;
  const KNOWN_NEW_MOON_JD = 2451550.1;
  let raw = (JD - KNOWN_NEW_MOON_JD) % SYNODIC_DAYS;
  if (raw < 0) raw += SYNODIC_DAYS;
  const fraction = raw / SYNODIC_DAYS;
  const illumination = Math.round(((1 - Math.cos(fraction * 2 * Math.PI)) / 2) * 100);

  let phaseName: string;
  if (fraction < 0.025 || fraction >= 0.975) phaseName = "New Moon";
  else if (fraction < 0.225) phaseName = "Waxing Crescent";
  else if (fraction < 0.275) phaseName = "First Quarter";
  else if (fraction < 0.475) phaseName = "Waxing Gibbous";
  else if (fraction < 0.525) phaseName = "Full Moon";
  else if (fraction < 0.725) phaseName = "Waning Gibbous";
  else if (fraction < 0.775) phaseName = "Last Quarter";
  else phaseName = "Waning Crescent";

  return { fraction, illumination, phaseName };
}

function daysUntilPhase(fraction: number, targetFraction: number): number {
  const delta = (((targetFraction - fraction) % 1) + 1) % 1;
  return Math.round(delta * SYNODIC_DAYS);
}

function calcSolarElevation(lat: number, lng: number, date: Date): number {
  const JD = date.getTime() / 86400000 + 2440587.5;
  const n = JD - 2451545.0;
  const L = (280.46 + 0.9856474 * n) % 360;
  const g = (357.528 + 0.9856003 * n) % 360;
  const lambda = L + 1.915 * Math.sin(g * RAD) + 0.02 * Math.sin(2 * g * RAD);
  const epsilon = 23.439 - 0.0000004 * n;
  const alpha = Math.atan2(
    Math.cos(epsilon * RAD) * Math.sin(lambda * RAD),
    Math.cos(lambda * RAD)
  );
  const delta = Math.asin(Math.sin(epsilon * RAD) * Math.sin(lambda * RAD));
  const UT = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  const GMST = (6.697375 + 0.0657098242 * n + UT) % 24;
  const LST = GMST + lng / 15;
  const H = (LST * 15 - alpha * DEG) % 360;
  return (
    Math.round(
      Math.asin(
        Math.sin(lat * RAD) * Math.sin(delta) +
        Math.cos(lat * RAD) * Math.cos(delta) * Math.cos(H * RAD)
      ) *
      DEG *
      10
    ) / 10
  );
}

function localTimeFraction(tz: string, date: Date): number {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    }).formatToParts(date);
    const h = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0");
    const m = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0");
    const s = parseInt(parts.find((p) => p.type === "second")?.value ?? "0");
    const correctedH = h === 24 ? 0 : h;
    return (correctedH * 3600 + m * 60 + s) / 86400;
  } catch {
    return 0;
  }
}

function timeStrToPct(isoStr: string): number {
  const timePart = isoStr.includes("T") ? isoStr.split("T")[1]! : isoStr;
  const [hStr, mStr] = timePart.split(":");
  const h = parseInt(hStr ?? "0");
  const m = parseInt(mStr ?? "0");
  return ((h * 3600 + m * 60) / 86400) * 100;
}

function extractHHMM(isoStr: string): string {
  return isoStr.includes("T") ? isoStr.split("T")[1]!.slice(0, 5) : isoStr.slice(0, 5);
}

// ── sub-components ───────────────────────────────────────────────────────────

function MoonGlyph({ fraction }: { fraction: number }) {
  const r = 8;
  const size = 20;
  const cx = size / 2;
  const cy = size / 2;
  const phaseAngle = fraction * 2 * Math.PI;
  const isWaxing = fraction <= 0.5;
  const termX = Math.cos(phaseAngle) * r;
  const termRx = Math.abs(termX);
  const isNew = fraction < 0.025 || fraction >= 0.975;
  const isFull = fraction > 0.475 && fraction < 0.525;

  if (isNew) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0" aria-hidden>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeOpacity={0.4} strokeWidth={1} />
      </svg>
    );
  }
  if (isFull) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0" aria-hidden>
        <circle cx={cx} cy={cy} r={r} fill="currentColor" fillOpacity={0.85} />
      </svg>
    );
  }

  let d: string;
  if (termRx < 0.5) {
    d = `M ${cx} ${cy - r} A ${r} ${r} 0 0 ${isWaxing ? 1 : 0} ${cx} ${cy + r} L ${cx} ${cy - r} Z`;
  } else if (isWaxing) {
    const sweep = termX > 0 ? 0 : 1;
    d = `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${termRx} ${r} 0 0 ${sweep} ${cx} ${cy - r} Z`;
  } else {
    const sweep = termX > 0 ? 1 : 0;
    d = `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} A ${termRx} ${r} 0 0 ${sweep} ${cx} ${cy - r} Z`;
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0" aria-hidden>
      <circle cx={cx} cy={cy} r={r} fill="currentColor" fillOpacity={0.08} stroke="currentColor" strokeOpacity={0.22} strokeWidth={0.75} />
      <path d={d} fill="currentColor" fillOpacity={0.82} />
    </svg>
  );
}

function DaylightBar({
  sunrisePct,
  sunsetPct,
  nowPct,
  sunriseTime,
  sunsetTime,
}: {
  sunrisePct: number;
  sunsetPct: number;
  nowPct: number;
  sunriseTime: string;
  sunsetTime: string;
}) {
  const bandPct = 2.2; // ~30min sliver approximating golden/blue hour, rendered as a gradient fade

  return (
    <div className="select-none">
      <div className="relative h-2.5 w-full overflow-hidden rounded-[1px] bg-muted">
        <div
          className="absolute inset-y-0 bg-foreground/18"
          style={{ left: `${sunrisePct}%`, right: `${100 - sunsetPct}%` }}
        />
        <div
          aria-hidden
          className="absolute inset-y-0 bg-linear-to-r from-transparent to-[oklch(0.55_0.06_255)]/45"
          style={{ left: `${Math.max(0, sunrisePct - bandPct)}%`, width: `${bandPct}%` }}
        />
        <div
          aria-hidden
          className="absolute inset-y-0 bg-linear-to-r from-[oklch(0.78_0.1_75)]/45 to-transparent"
          style={{ left: `${sunrisePct}%`, width: `${bandPct}%` }}
        />
        <div
          aria-hidden
          className="absolute inset-y-0 bg-linear-to-r from-transparent to-[oklch(0.78_0.1_75)]/45"
          style={{ left: `${Math.max(0, sunsetPct - bandPct)}%`, width: `${bandPct}%` }}
        />
        <div
          aria-hidden
          className="absolute inset-y-0 bg-linear-to-r from-[oklch(0.55_0.06_255)]/45 to-transparent"
          style={{ left: `${sunsetPct}%`, width: `${bandPct}%` }}
        />
        <div
          className="absolute inset-y-0 w-0.5 bg-foreground/65 motion-safe:animate-pulse"
          style={{ left: `${Math.min(99.5, nowPct)}%` }}
        />
      </div>
      <div className="relative mt-1 h-3 font-mono text-[9px] text-muted-foreground tabular-nums">
        <span
          className="absolute"
          style={{ left: `${sunrisePct}%`, transform: "translateX(-50%)" }}
        >
          {sunriseTime}
        </span>
        <span
          className="absolute"
          style={{ left: `${sunsetPct}%`, transform: "translateX(-50%)" }}
        >
          {sunsetTime}
        </span>
      </div>
    </div>
  );
}

// ── main ─────────────────────────────────────────────────────────────────────

function initExtra(): TimeExtra {
  const now = new Date();
  return {
    dayOfWeek: new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "short" })
      .format(now)
      .toUpperCase(),
    dateStr: new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
      .format(now)
      .toUpperCase(),
    epoch: Math.floor(now.getTime() / 1000),
    utcOffset: computeUtcOffset(TZ),
    tzAbbr: computeTzAbbr(TZ),
  };
}

export function TimeCard() {
  const [extra, setExtra] = useState<TimeExtra>(initExtra);
  const [sunTimes, setSunTimes] = useState<SunTimes | null>(null);
  const [solarLive, setSolarLive] = useState<SolarLive | null>(null);
  const [moon, setMoon] = useState<MoonData>(() => getMoonPhase(new Date()));
  const [sunError, setSunError] = useState(false);
  const [epochCopied, setEpochCopied] = useState(false);
  const [visitorTz, setVisitorTz] = useState<string | null>(null);
  const sunTimesRef = useRef<SunTimes | null>(null);

  // Detect the visitor's timezone once on mount (client-only, avoids hydration mismatch)
  useEffect(() => {
    const detectVisitorTz = () => {
      try {
        setVisitorTz(Intl.DateTimeFormat().resolvedOptions().timeZone || null);
      } catch {
        setVisitorTz(null);
      }
    };
    detectVisitorTz();
  }, []);

  function handleCopyEpoch() {
    navigator.clipboard.writeText(String(extra.epoch)).then(() => {
      setEpochCopied(true);
      setTimeout(() => setEpochCopied(false), 1200);
    }).catch(() => { });
  }

  // Per-second ticker: epoch counter and solar "now" position
  useEffect(() => {
    const fastTick = () => {
      const now = new Date();
      setExtra((prev) => ({ ...prev, epoch: Math.floor(now.getTime() / 1000) }));
      if (sunTimesRef.current) {
        setSolarLive({
          elevation: calcSolarElevation(LAT, LNG, now),
          nowPct: localTimeFraction(TZ, now) * 100,
        });
      }
    };
    fastTick();
    const id = setInterval(fastTick, 1000);
    return () => clearInterval(id);
  }, []);

  // Per-minute ticker: date metadata and moon phase (effectively static within a day)
  useEffect(() => {
    const slowTick = () => {
      const now = new Date();
      setExtra((prev) => ({
        ...prev,
        dayOfWeek: new Intl.DateTimeFormat("en-US", {
          timeZone: TZ,
          weekday: "short",
        })
          .format(now)
          .toUpperCase(),
        dateStr: new Intl.DateTimeFormat("en-US", {
          timeZone: TZ,
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
          .format(now)
          .toUpperCase(),
        utcOffset: computeUtcOffset(TZ),
        tzAbbr: computeTzAbbr(TZ),
      }));
      setMoon(getMoonPhase(now));
    };
    const id = setInterval(slowTick, 60000);
    return () => clearInterval(id);
  }, []);

  // Fetch sunrise/sunset once on mount
  useEffect(() => {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(LAT));
    url.searchParams.set("longitude", String(LNG));
    url.searchParams.set("daily", "sunrise,sunset,daylight_duration");
    url.searchParams.set("timezone", TZ);
    url.searchParams.set("forecast_days", "1");

    fetch(url.toString())
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        const sunrise = data.daily.sunrise[0] as string;
        const sunset = data.daily.sunset[0] as string;
        const daylightSec = data.daily.daylight_duration[0] as number;
        const h = Math.floor(daylightSec / 3600);
        const m = String(Math.round((daylightSec % 3600) / 60)).padStart(2, "0");
        const st: SunTimes = {
          sunrise: extractHHMM(sunrise),
          sunset: extractHHMM(sunset),
          dayLengthStr: `${h}h ${m}m`,
          sunrisePct: timeStrToPct(sunrise),
          sunsetPct: timeStrToPct(sunset),
        };
        sunTimesRef.current = st;
        setSunTimes(st);
        // Seed the live values immediately
        const now = new Date();
        setSolarLive({
          elevation: calcSolarElevation(LAT, LNG, now),
          nowPct: localTimeFraction(TZ, now) * 100,
        });
      })
      .catch(() => setSunError(true));
  }, []);

  const showSolar = sunTimes && solarLive;

  const now = new Date(extra.epoch * 1000);
  const visitorDeltaMin = visitorTz ? computeOffsetMinutes(TZ, now) - computeOffsetMinutes(visitorTz, now) : 0;
  const showVisitorTime = visitorTz !== null && visitorDeltaMin !== 0;

  const solstice = nextSolstice(now, LAT >= 0);
  const daysUntilSolstice = Math.max(0, Math.ceil((solstice.date.getTime() - now.getTime()) / 86400000));
  const solsticeDateStr = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    month: "short",
    day: "numeric",
  }).format(solstice.date);

  return (
    <Card className=" h-full flex flex-col relative">
      <CardWatermark icon={ClockIcon} />
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Local Time
        </CardTitle>
        <CardAction>
          <LiveDot />
        </CardAction>
      </CardHeader>
      <CardContent className="no-scrollbar flex min-h-0 flex-1 flex-col justify-between gap-3 overflow-x-hidden overflow-y-auto">
        {/* Clock row */}
        <div className="flex flex-wrap items-end gap-3">
          <div className="text-5xl">
            <Clock />
          </div>
          <div className="flex gap-1.5 pb-1">
            <Badge variant="secondary" className="font-mono text-xs">
              {extra.tzAbbr}
            </Badge>
            <Badge variant="outline" className="font-mono text-xs">
              {extra.utcOffset}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Time metadata */}
        <dl className="grid grid-cols-1 gap-x-8 gap-y-1.5 font-mono text-xs @sm/card-content:grid-cols-2">
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">DAY</dt>
            <dd>{extra.dayOfWeek}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">DATE</dt>
            <dd>{extra.dateStr}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">EPOCH</dt>
            <dd>
              <button
                type="button"
                onClick={handleCopyEpoch}
                aria-label="Copy epoch timestamp"
                className="tabular-nums underline decoration-dotted decoration-muted-foreground/40 underline-offset-2 cursor-pointer transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {epochCopied ? "COPIED" : extra.epoch}
              </button>
            </dd>
          </div>
          <div className="flex min-w-0 justify-between gap-2">
            <dt className="shrink-0 text-muted-foreground">TZ</dt>
            <dd className="truncate text-right">{TZ}</dd>
          </div>
          {showVisitorTime ? (
            <div className="flex justify-between gap-2 @sm/card-content:col-span-2">
              <dt className="shrink-0 text-muted-foreground">YOUR TIME</dt>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <dd className="cursor-default tabular-nums">
                      {formatClockHHMM(visitorTz!, now)}{" "}
                      <span className="text-muted-foreground">{formatOffsetDelta(visitorDeltaMin)}</span>
                    </dd>
                  </TooltipTrigger>
                  <TooltipContent className="font-mono text-[11px]">
                    {describeOffsetDelta(visitorDeltaMin)}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ) : null}
        </dl>

        <Separator />

        {/* Solar & lunar section */}
        {showSolar ? (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 gap-x-8 gap-y-3 font-mono text-xs @md/card-content:grid-cols-2 @md/card-content:gap-y-0">
              {/* Sun */}
              <dl className="flex flex-col gap-1.5">
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">SUNRISE</dt>
                  <dd className="tabular-nums">{sunTimes.sunrise}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">SUNSET</dt>
                  <dd className="tabular-nums">{sunTimes.sunset}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">DAY LEN</dt>
                  <dd className="tabular-nums">{sunTimes.dayLengthStr}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">SOLAR ELEV</dt>
                  <dd className="tabular-nums">
                    {solarLive.elevation > 0 ? "+" : ""}
                    {solarLive.elevation}°
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">SOLSTICE</dt>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <dd className="cursor-default tabular-nums">
                          {daysUntilSolstice === 0 ? "TODAY" : `${daysUntilSolstice}D`}
                        </dd>
                      </TooltipTrigger>
                      <TooltipContent className="font-mono text-[11px]">
                        {solstice.name} · {solsticeDateStr}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </dl>
              {/* Moon */}
              <dl className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center gap-2 min-w-0">
                  <dt className="shrink-0 text-muted-foreground">PHASE</dt>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <dd className="flex min-w-0 cursor-default items-center gap-1.5">
                          <MoonGlyph fraction={moon.fraction} />
                          <span className="truncate">{moon.phaseName}</span>
                        </dd>
                      </TooltipTrigger>
                      <TooltipContent className="font-mono text-[11px]">
                        {daysUntilPhase(moon.fraction, 0.5) === 0
                          ? "Full moon tonight"
                          : `Full moon in ${daysUntilPhase(moon.fraction, 0.5)}d`}
                        {" · "}
                        {daysUntilPhase(moon.fraction, 0) === 0
                          ? "new moon tonight"
                          : `new moon in ${daysUntilPhase(moon.fraction, 0)}d`}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">LIT</dt>
                  <dd className="tabular-nums">{moon.illumination}%</dd>
                </div>
              </dl>
            </div>

            <DaylightBar
              sunrisePct={sunTimes.sunrisePct}
              sunsetPct={sunTimes.sunsetPct}
              nowPct={solarLive.nowPct}
              sunriseTime={sunTimes.sunrise}
              sunsetTime={sunTimes.sunset}
            />
          </div>
        ) : sunError ? (
          <p className="font-mono text-xs text-muted-foreground">
            SOLAR_ERR — data unavailable
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
