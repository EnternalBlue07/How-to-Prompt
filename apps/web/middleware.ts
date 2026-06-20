import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/app(.*)"]);
const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const hasClerkKey =
  typeof clerkKey === "string" &&
  !clerkKey.includes("placeholder") &&
  clerkKey.length > 40 &&
  /^pk_(test|live)_[A-Za-z0-9_-]+$/.test(clerkKey);

const authMiddleware = clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) await auth.protect();
});

export default function middleware(request: NextRequest, event: NextFetchEvent) {
  if (!hasClerkKey) {
    return NextResponse.next();
  }

  return authMiddleware(request, event);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
