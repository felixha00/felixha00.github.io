// lib/getClientIp.ts
import { NextRequest } from "next/server";

export function getClientIp(req: NextRequest) {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(/, /)[0] : "0.0.0.0";
    return ip;
}