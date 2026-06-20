"use client";

import { ClerkProvider } from "@clerk/nextjs";

function hasConfiguredClerkKey() {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return (
    typeof key === "string" &&
    !key.includes("placeholder") &&
    key.length > 40 &&
    /^pk_(test|live)_[A-Za-z0-9_-]+$/.test(key)
  );
}

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  if (!hasConfiguredClerkKey()) {
    return children;
  }

  return <ClerkProvider>{children}</ClerkProvider>;
}
