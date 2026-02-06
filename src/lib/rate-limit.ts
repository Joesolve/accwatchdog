import { NextRequest, NextResponse } from "next/server";

interface RateLimitConfig {
  interval: number; // in milliseconds
  maxRequests: number;
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(config: RateLimitConfig) {
  return async function middleware(request: NextRequest) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const key = `${ip}:${request.nextUrl.pathname}`;
    const now = Date.now();

    const record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.interval,
      });
      return null;
    }

    if (record.count >= config.maxRequests) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((record.resetTime - now) / 1000)),
          },
        }
      );
    }

    record.count++;
    return null;
  };
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

// Helper for API routes
export function checkRateLimit(
  request: NextRequest,
  maxRequests: number = 10,
  interval: number = 60000
): NextResponse | null {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  const key = `${ip}:${request.nextUrl.pathname}`;
  const now = Date.now();

  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + interval,
    });
    return null;
  }

  if (record.count >= maxRequests) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((record.resetTime - now) / 1000)),
        },
      }
    );
  }

  record.count++;
  return null;
}
