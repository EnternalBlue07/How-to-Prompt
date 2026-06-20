import { SignedIn } from "@clerk/nextjs";
import { listWorkspaces, createMockWorkspace, hasConfiguredClerkKey } from "@/lib/api";
import { DashboardClient } from "@/components/DashboardClient";

export default async function AppPage() {
  const workspaces = await listWorkspaces();
  const isClerkConfigured = hasConfiguredClerkKey();

  async function handleCreateWorkspace(name: string) {
    "use server";
    return createMockWorkspace(name);
  }

  const content = (
    <DashboardClient
      initialWorkspaces={workspaces}
      isClerkConfigured={isClerkConfigured}
      createWorkspaceAction={handleCreateWorkspace}
    />
  );

  if (isClerkConfigured) {
    return <SignedIn>{content}</SignedIn>;
  }

  return content;
}
