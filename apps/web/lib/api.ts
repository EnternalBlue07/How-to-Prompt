import { auth } from "@clerk/nextjs/server";
import { clientEnv } from "@/lib/env";

export type Workspace = {
  id: string;
  name: string;
  slug: string;
  role: "owner" | "admin" | "member" | "viewer";
};

export async function listWorkspaces(): Promise<Workspace[]> {
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
}
