import { NextResponse } from "next/server";

const TZ = process.env.NEXT_PUBLIC_MY_TIMEZONE || "America/Toronto";
const LAT = process.env.NEXT_PUBLIC_MY_LAT || "43.6532";
const LNG = process.env.NEXT_PUBLIC_MY_LNG || "-79.3832";
const CITY = process.env.NEXT_PUBLIC_MY_CITY || "Toronto";

export const revalidate = 1800;

export async function GET() {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", LAT);
  url.searchParams.set("longitude", LNG);
  url.searchParams.set(
    "current",
    "temperature_2m,weather_code,apparent_temperature,wind_speed_10m"
  );
  url.searchParams.set("hourly", "temperature_2m");
  url.searchParams.set("timezone", TZ);
  url.searchParams.set("forecast_days", "1");

  const res = await fetch(url.toString());
  if (!res.ok) {
    return NextResponse.json(
      { error: `open-meteo ${res.status}` },
      { status: 502 }
    );
  }

  const data = await res.json();
  return NextResponse.json({ ...data, city: CITY, timezone: TZ });
}
