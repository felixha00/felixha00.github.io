"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  Sun,
  Thermometer,
  Wind,
  type LucideIcon,
} from "lucide-react";

const TZ = process.env.NEXT_PUBLIC_MY_TIMEZONE || "America/Toronto";
const LAT = parseFloat(process.env.NEXT_PUBLIC_MY_LAT || "43.6532");
const LNG = parseFloat(process.env.NEXT_PUBLIC_MY_LNG || "-79.3832");
const CITY = process.env.NEXT_PUBLIC_MY_CITY || "Toronto";

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

const tempChartConfig = {
  temp: {
    label: "°C",
    color: "var(--foreground)",
  },
} satisfies ChartConfig;

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
      <Card className="rounded-none h-full flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Weather
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="font-mono text-xs text-muted-foreground">
            FETCH_ERROR — weather data unavailable
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className="rounded-none h-full flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Weather
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 flex-1">
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
    <Card className="rounded-none h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Weather · {CITY}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 flex-1">
        <TooltipProvider>
          <div className="flex items-center gap-3">
            <Icon className="size-8 shrink-0 text-muted-foreground" />
            <div>
              <div className="font-display text-4xl tabular-nums leading-none">
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
