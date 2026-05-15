"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Area,
  AreaChart,
  ReferenceDot,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  MapPin,
  Sun,
  Thermometer,
  Wind,
  type LucideIcon,
} from "lucide-react";

const TZ = process.env.NEXT_PUBLIC_MY_TIMEZONE || "America/Toronto";
const LAT = parseFloat(process.env.NEXT_PUBLIC_MY_LAT || "43.6532");
const LNG = parseFloat(process.env.NEXT_PUBLIC_MY_LNG || "-79.3832");
const CITY = process.env.NEXT_PUBLIC_MY_CITY || "Toronto";
const REGION = process.env.NEXT_PUBLIC_MY_REGION || "ON";
const COUNTRY = process.env.NEXT_PUBLIC_MY_COUNTRY || "Canada";

function getWeatherInfo(code: number): { label: string; Icon: LucideIcon } {
  if (code === 0) return { label: "Clear", Icon: Sun };
  if (code <= 2) return { label: "Partly cloudy", Icon: CloudSun };
  if (code === 3) return { label: "Overcast", Icon: Cloud };
  if (code <= 48) return { label: "Fog", Icon: CloudFog };
  if (code <= 55) return { label: "Drizzle", Icon: CloudDrizzle };
  if (code <= 65) return { label: "Rain", Icon: CloudRain };
  if (code <= 75) return { label: "Snow", Icon: CloudSnow };
  if (code <= 82) return { label: "Showers", Icon: CloudRain };
  return { label: "Thunderstorm", Icon: CloudLightning };
}

type WeatherData = {
  current: {
    temperature_2m: number;
    weather_code: number;
    apparent_temperature: number;
    wind_speed_10m: number;
  };
  hourly: {
    temperature_2m: number[];
  };
};

type TimeExtra = {
  dayOfWeek: string;
  dateStr: string;
  epoch: number;
  utcOffset: string;
  tzAbbr: string;
};

function computeUtcOffset(tz: string): string {
  try {
    const now = new Date();
    const utcMs = new Date(now.toLocaleString("en-US", { timeZone: "UTC" })).getTime();
    const tzMs = new Date(now.toLocaleString("en-US", { timeZone: tz })).getTime();
    const diffH = (tzMs - utcMs) / 3600000;
    const sign = diffH >= 0 ? "+" : "-";
    const abs = Math.abs(diffH);
    const h = String(Math.floor(abs)).padStart(2, "0");
    const m = String(Math.round((abs % 1) * 60)).padStart(2, "0");
    return `UTC${sign}${h}:${m}`;
  } catch {
    return "UTC";
  }
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

export function TimeCard() {
  const [extra, setExtra] = useState<TimeExtra | null>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setExtra({
        dayOfWeek: new Intl.DateTimeFormat("en-US", {
          timeZone: TZ,
          weekday: "short",
        }).format(now).toUpperCase(),
        dateStr: new Intl.DateTimeFormat("en-US", {
          timeZone: TZ,
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(now).toUpperCase(),
        epoch: Math.floor(now.getTime() / 1000),
        utcOffset: computeUtcOffset(TZ),
        tzAbbr: computeTzAbbr(TZ),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Card className="md:col-span-2 rounded-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Local Time
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="text-5xl">
            <Clock />
          </div>
          {extra ? (
            <div className="flex gap-1.5 pb-1">
              <Badge variant="secondary" className="font-mono text-xs">
                {extra.tzAbbr}
              </Badge>
              <Badge variant="outline" className="font-mono text-xs">
                {extra.utcOffset}
              </Badge>
            </div>
          ) : (
            <Skeleton className="h-6 w-28" />
          )}
        </div>

        <Separator />

        {extra ? (
          <dl className="grid grid-cols-2 gap-x-8 gap-y-1.5 font-mono text-xs">
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">DAY</dt>
              <dd>{extra.dayOfWeek}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">DATE</dt>
              <dd>{extra.dateStr}</dd>
            </div>
            <div className="col-span-2 flex justify-between gap-2">
              <dt className="text-muted-foreground">EPOCH</dt>
              <dd className="tabular-nums">{extra.epoch}</dd>
            </div>
            <div className="col-span-2 flex justify-between gap-2">
              <dt className="shrink-0 text-muted-foreground">TZ</dt>
              <dd className="truncate text-right">{TZ}</dd>
            </div>
          </dl>
        ) : (
          <div className="flex flex-col gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LocationCard() {
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

const tempChartConfig = {
  temp: {
    label: "°C",
    color: "var(--foreground)",
  },
} satisfies ChartConfig;

function formatHourLabel(h: number): string {
  const n = Number(h);
  if (n === 0) return "12AM";
  if (n === 12) return "12PM";
  return `${n < 12 ? n : n - 12}${n < 12 ? "AM" : "PM"}`;
}

function TempGraph({
  temps,
  currentHour,
}: {
  temps: number[];
  currentHour: number;
}) {
  if (temps.length < 2) return null;

  const clampedH = Math.min(Math.max(currentHour, 0), 23);
  const floorH = Math.floor(clampedH);
  const frac = clampedH - floorH;
  const tempNow =
    temps[floorH] +
    (temps[Math.min(floorH + 1, temps.length - 1)] - temps[floorH]) * frac;

  const chartData = temps.slice(0, 24).map((temp, i) => ({ hour: i, temp }));

  return (
    <ChartContainer config={tempChartConfig} className="h-25 w-full">
      <AreaChart data={chartData} margin={{ top: 6, right: 2, bottom: 0, left: 2 }}>
        <defs>
          <linearGradient id="tempAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-temp)" stopOpacity={0.18} />
            <stop offset="100%" stopColor="var(--color-temp)" stopOpacity={0.01} />
          </linearGradient>
        </defs>

        <XAxis
          dataKey="hour"
          type="number"
          domain={[0, 23]}
          ticks={[0, 6, 12, 18]}
          tickFormatter={formatHourLabel}
          tickLine={false}
          axisLine={false}
          tickMargin={2}
          height={22}
        />
        <YAxis hide domain={["auto", "auto"]} />

        <ReferenceLine
          x={clampedH}
          stroke="currentColor"
          strokeOpacity={0.2}
          strokeDasharray="3 3"
          strokeWidth={1}
        />
        <ReferenceDot
          x={clampedH}
          y={tempNow}
          r={3}
          fill="var(--color-temp)"
          fillOpacity={0.9}
          stroke="none"
        />

        <ChartTooltip
          cursor={false}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const point = payload[0]?.payload as { hour: number; temp: number } | undefined;
            if (!point) return null;
            return (
              <div className="grid min-w-28 items-start gap-1 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                <span className="font-mono text-muted-foreground">{formatHourLabel(point.hour)}</span>
                <div className="flex items-center gap-1.5">
                  <div className="size-2 shrink-0 rounded-full bg-foreground" />
                  <span className="font-mono">{Math.round(point.temp)}°C</span>
                </div>
              </div>
            );
          }}
        />

        <Area
          type="natural"
          dataKey="temp"
          stroke="var(--color-temp)"
          strokeWidth={1.5}
          fill="url(#tempAreaFill)"
          strokeOpacity={0.7}
          dot={false}
          isAnimationActive={false}
          activeDot={{ r: 3, fill: "var(--color-temp)", strokeWidth: 0 }}
        />
      </AreaChart>
    </ChartContainer>
  );
}

export function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);
  const [currentHour, setCurrentHour] = useState(0);

  useEffect(() => {
    const updateHour = () => {
      try {
        const parts = new Intl.DateTimeFormat("en-US", {
          timeZone: TZ,
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        }).formatToParts(new Date());
        const h = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
        const m = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0", 10);
        setCurrentHour(h === 24 ? 0 : h + m / 60);
      } catch {
        setCurrentHour(new Date().getHours());
      }
    };
    updateHour();
    const id = setInterval(updateHour, 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(LAT));
    url.searchParams.set("longitude", String(LNG));
    url.searchParams.set("current", "temperature_2m,weather_code,apparent_temperature,wind_speed_10m");
    url.searchParams.set("hourly", "temperature_2m");
    url.searchParams.set("timezone", TZ);
    url.searchParams.set("forecast_days", "1");

    fetch(url.toString())
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json();
      })
      .then((data: WeatherData) => setWeather(data))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <Card className="rounded-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-mono text-xs text-muted-foreground">
            FETCH_ERROR — weather data unavailable
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className="rounded-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Weather
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-9 rounded-full" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
          <Separator />
          <Skeleton className="h-14 w-full" />
        </CardContent>
      </Card>
    );
  }

  const { label, Icon } = getWeatherInfo(weather.current.weather_code);
  const temps = weather.hourly.temperature_2m.slice(0, 24);
  const lo = Math.round(Math.min(...temps));
  const hi = Math.round(Math.max(...temps));
  const todayLabel = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date()).toUpperCase();

  return (
    <Card className="rounded-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Weather · {CITY}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <TooltipProvider>
          <div className="flex items-center gap-3">
            <Icon className="size-8 shrink-0 text-muted-foreground" />
            <div>
              <div className="font-mono text-3xl font-semibold tabular-nums leading-none">
                {Math.round(weather.current.temperature_2m)}°C
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
            </div>
            <div className="ml-auto flex flex-col items-end gap-1 font-mono text-xs text-muted-foreground">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex cursor-default items-center gap-1">
                    <Thermometer className="size-3" />
                    <span>Feels {Math.round(weather.current.apparent_temperature)}°</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Apparent temperature</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex cursor-default items-center gap-1">
                    <Wind className="size-3" />
                    <span>{Math.round(weather.current.wind_speed_10m)} km/h</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Wind speed at 10m</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </TooltipProvider>

        <Separator />

        <div className="flex items-baseline justify-between font-mono text-xs text-muted-foreground">
          <span>{todayLabel}</span>
          <span className="tabular-nums">{lo}° — {hi}°</span>
        </div>

        <TempGraph temps={temps} currentHour={currentHour} />
      </CardContent>
    </Card>
  );
}

const statsItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

export default function StatsGrid() {
  return (
    <motion.div
      className="grid grid-cols-1 gap-4 md:grid-cols-3"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.div variants={statsItemVariants}><TimeCard /></motion.div>
      <motion.div variants={statsItemVariants}><LocationCard /></motion.div>
      <motion.div variants={statsItemVariants}><WeatherCard /></motion.div>
    </motion.div>
  );
}
