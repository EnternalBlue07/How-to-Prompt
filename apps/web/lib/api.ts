import { auth } from "@clerk/nextjs/server";
import { clientEnv } from "@/lib/env";

export type Workspace = {
  id: string;
  name: string;
  slug: string;
  role: "owner" | "admin" | "member" | "viewer";
};

// Simple server-side in-memory cache for mock workspaces in development
const devWorkspaces: Workspace[] = [
  { id: "ws-1", name: "Core Neural Network", slug: "core-neural-net", role: "owner" },
  { id: "ws-2", name: "Agent Swarm Sandbox", slug: "agent-swarm-sandbox", role: "admin" },
  { id: "ws-3", name: "Memory Engine Evaluation", slug: "memory-engine-eval", role: "member" },
];

export function hasConfiguredClerkKey(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return (
    typeof key === "string" &&
    !key.includes("placeholder") &&
    key.length > 40 &&
    /^pk_(test|live)_[A-Za-z0-9_-]+$/.test(key)
  );
}

export async function listWorkspaces(): Promise<Workspace[]> {
  if (!hasConfiguredClerkKey()) {
    // Development bypass mode
    return devWorkspaces;
  }

  try {
    const { getToken } = await auth();
    const token = await getToken();
    const response = await fetch(`${clientEnv.NEXT_PUBLIC_API_URL}/v1/workspaces`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      next: { tags: ["workspaces"], revalidate: 30 },
    });

    if (!response.ok) {
      throw new Error(`Workspace request failed with status ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.warn("Clerk auth failed or backend unreachable, falling back to mock workspaces:", error);
    return devWorkspaces;
  }
}

export async function createMockWorkspace(name: string): Promise<Workspace> {
  const newWorkspace: Workspace = {
    id: `ws-${Math.random().toString(36).substring(2, 9)}`,
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    role: "owner",
  };
  devWorkspaces.push(newWorkspace);
  return newWorkspace;
}
