import { SignedIn, UserButton } from "@clerk/nextjs";
import { Plus, ShieldCheck } from "lucide-react";
import { listWorkspaces } from "@/lib/api";

export default async function AppPage() {
  const workspaces = await listWorkspaces();

  return (
    <SignedIn>
      <main className="min-h-screen bg-[var(--background)]">
        <header className="flex h-16 items-center justify-between border-b border-[var(--border)] px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Control Plane</p>
            <h1 className="text-lg font-semibold">Workspaces</h1>
          </div>
          <UserButton />
        </header>
        <section className="grid gap-4 p-6 lg:grid-cols-[280px_1fr]">
          <aside className="border border-[var(--border)] bg-[var(--panel)] p-4">
            <button className="flex h-10 w-full items-center justify-center gap-2 bg-[var(--accent)] px-3 text-sm font-semibold text-black">
              <Plus size={16} /> New workspace
            </button>
          </aside>
          <div className="grid gap-3">
            {workspaces.map((workspace) => (
              <article
                key={workspace.id}
                className="flex items-center justify-between border border-[var(--border)] bg-[var(--panel)] p-5"
              >
                <div>
                  <h2 className="font-semibold">{workspace.name}</h2>
                  <p className="text-sm text-[var(--muted)]">/{workspace.slug}</p>
                </div>
                <span className="inline-flex items-center gap-2 text-sm text-[var(--accent-2)]">
                  <ShieldCheck size={16} /> {workspace.role}
                </span>
              </article>
            ))}
          </div>
        </section>
      </main>
    </SignedIn>
  );
}
