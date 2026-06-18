import Link from "next/link";
import { ArrowRight, Boxes, GraduationCap, Workflow } from "lucide-react";

const capabilities = [
  { label: "Prompt University", icon: GraduationCap },
  { label: "Prompt IDE", icon: Workflow },
  { label: "Agent Builder", icon: Boxes },
];

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-5">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <span className="text-sm font-semibold tracking-[0.18em] text-[var(--accent)]">
          PROMPTVERSE X
        </span>
        <Link
          href="/app"
          className="inline-flex h-10 items-center gap-2 border border-[var(--border)] px-4 text-sm text-[var(--foreground)]"
        >
          Open OS <ArrowRight size={16} />
        </Link>
      </nav>
      <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-10 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h1 className="max-w-4xl text-5xl font-semibold leading-tight md:text-7xl">
            PromptVerse X
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            A production AI workspace for prompt education, playgrounds, agent systems, context
            engineering, memory, benchmarking, and enterprise governance.
          </p>
        </div>
        <div className="grid gap-3">
          {capabilities.map((capability) => {
            const Icon = capability.icon;
            return (
              <div
                key={capability.label}
                className="flex items-center justify-between border border-[var(--border)] bg-[var(--panel)] p-5"
              >
                <span className="font-medium">{capability.label}</span>
                <Icon aria-hidden size={22} className="text-[var(--accent-2)]" />
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
