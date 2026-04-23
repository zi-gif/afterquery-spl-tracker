import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const DAILY_LIMIT = 10;

// Upstash-backed limiter (production). Lazily constructed on first call.
let upstashLimiter = null;
function getUpstashLimiter() {
  if (upstashLimiter) return upstashLimiter;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  const redis = new Redis({ url, token });
  upstashLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(DAILY_LIMIT, "1 d"),
    prefix: "afterquery-spl",
    analytics: true,
  });
  return upstashLimiter;
}

// In-memory fallback for local dev. Resets with the server.
const memory = new Map();
function memoryCheck(ip) {
  const day = new Date().toISOString().slice(0, 10);
  const key = `${ip}:${day}`;
  const count = memory.get(key) || 0;
  if (count >= DAILY_LIMIT) {
    return { success: false, remaining: 0, limit: DAILY_LIMIT };
  }
  memory.set(key, count + 1);
  return { success: true, remaining: DAILY_LIMIT - (count + 1), limit: DAILY_LIMIT };
}

function getClientIp(req) {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "anon";
}

export async function checkRateLimit(req) {
  const ip = getClientIp(req);
  const limiter = getUpstashLimiter();
  if (limiter) {
    const { success, remaining, limit } = await limiter.limit(ip);
    return { success, remaining, limit };
  }
  return memoryCheck(ip);
}

export { DAILY_LIMIT };
