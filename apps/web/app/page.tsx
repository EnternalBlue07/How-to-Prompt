"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  GraduationCap,
  Workflow,
  Terminal,
  Cpu,
  Sparkles,
  Database,
  Shield,
  CheckCircle2,
  Layers
} from "lucide-react";

// Types for prompt simulation
type PromptTemplate = {
  name: string;
  systemPrompt: string;
  userPrompt: string;
  output: string;
  tokens: number;
  latency: string;
  cost: string;
  accuracy: string;
  vectorDensity: number[];
};

const SIMULATION_TEMPLATES: Record<string, PromptTemplate> = {
  router: {
    name: "RAG Intent Router",
    systemPrompt: "You are a high-speed router. Classify user queries into DATABASE, CODE, or AGENT.",
    userPrompt: "Find all transaction logs where latency was over 500ms in the last 2 hours.",
    output: '{\n  "intent": "DATABASE",\n  "confidence": 0.987,\n  "target_index": "transaction_logs_v4",\n  "filters": {\n    "latency": ">500ms",\n    "timeframe": "2h"\n  }\n}',
    tokens: 142,
    latency: "64ms",
    cost: "$0.00028",
    accuracy: "99.4%",
    vectorDensity: [0.12, 0.45, 0.88, 0.23, 0.91, 0.34, 0.12, 0.67, 0.89, 0.54, 0.77, 0.23]
  },
  planner: {
    name: "CoT Agent Planner",
    systemPrompt: "You are a multi-step agent planner. Break down the task into execution sequences.",
    userPrompt: "Compare Q2 sales performance in the US vs EMEA and update the slide deck.",
    output: "1. EXECUTE: SQL query on sales db (Q2, region='US')\n2. EXECUTE: SQL query on sales db (Q2, region='EMEA')\n3. PROCESS: Calculate delta and percentage difference\n4. AGENT: Invoke SlidesExporter with calculated dataset\n5. VERIFY: Confirm slide format and token schema",
    tokens: 418,
    latency: "340ms",
    cost: "$0.00164",
    accuracy: "96.8%",
    vectorDensity: [0.65, 0.78, 0.23, 0.94, 0.12, 0.45, 0.67, 0.34, 0.12, 0.99, 0.54, 0.88]
  },
  guardrail: {
    name: "PII & Tox Guardrail",
    systemPrompt: "Inspect content for personal identifiable information (PII) or toxicity. Block unsafe input.",
    userPrompt: "Draft email to user zumaan@example.com stating their password reset code is 4421-998.",
    output: '{\n  "flagged": true,\n  "violations": ["PII_EMAIL", "PLAINTEXT_SECRET"],\n  "action": "REDACT_AND_WARN",\n  "sanitized": "Draft email to user [REDACTED_EMAIL] stating password code is [REDACTED]"\n}',
    tokens: 189,
    latency: "45ms",
    cost: "$0.00018",
    accuracy: "99.9%",
    vectorDensity: [0.91, 0.12, 0.45, 0.67, 0.89, 0.12, 0.34, 0.56, 0.78, 0.23, 0.45, 0.12]
  }
};

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState<string>("router");
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [compilerLogs, setCompilerLogs] = useState<string[]>([]);
  const [simulatedOutput, setSimulatedOutput] = useState<string>("");

  // Background Interactive Particle Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle class
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 0.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;
      }

      draw(c: CanvasRenderingContext2D) {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = "rgba(16, 185, 129, 0.25)";
        c.fill();
      }
    }

    const particles: Particle[] = Array.from({ length: 65 }, () => new Particle());
    const mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      // Draw lines between close particles
      ctx.strokeStyle = "rgba(16, 185, 129, 0.04)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw lines to mouse
      if (mouse.x > -1000) {
        particles.forEach((p) => {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.12 * (1 - dist / 150)})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Run Simulated Compilation whenever the tab changes
  useEffect(() => {
    let active = true;
    setIsCompiling(true);
    setCompilerLogs([]);
    setSimulatedOutput("");

    const logs = [
      "Initializing environment variables...",
      "Matching database schemas & indexes...",
      "Resolving template context dependencies...",
      "Compiling Abstract Syntax Tree (AST)...",
      "Injecting prompt guardrail policies...",
      "Tokenizing combined prompt context...",
      "Executing mock pipeline on LLM cluster..."
    ];

    let currentLogIndex = 0;
    const logInterval = setInterval(() => {
      if (!active) return;
      if (currentLogIndex < logs.length) {
        setCompilerLogs((prev) => [...prev, `[info] ${logs[currentLogIndex]}`]);
        currentLogIndex++;
      } else {
        clearInterval(logInterval);
        setIsCompiling(false);
        // Start streaming output tokens
        const outText = SIMULATION_TEMPLATES[activeTab].output;
        let charIndex = 0;
        const textInterval = setInterval(() => {
          if (!active) return;
          if (charIndex <= outText.length) {
            setSimulatedOutput(outText.substring(0, charIndex));
            charIndex += 3;
          } else {
            clearInterval(textInterval);
          }
        }, 15);
      }
    }, 180);

    return () => {
      active = false;
      clearInterval(logInterval);
    };
  }, [activeTab]);

  const activeTemplate = SIMULATION_TEMPLATES[activeTab];

  return (
    <main className="relative min-h-screen bg-dot-grid px-6 py-5 md:px-12 select-none">
      {/* Interactive Background Canvas */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 -z-10" />

      {/* Futuristic Nav */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-4">
          <span className="font-display text-lg font-bold tracking-[0.25em] text-[var(--accent)] drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            PROMPTVERSE X
          </span>
          <span className="hidden items-center gap-1.5 border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-0.5 text-[10px] font-mono tracking-widest text-emerald-400 uppercase rounded-sm md:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 status-pulse" />
            SYS_STATUS: NOMINAL
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-4 text-xs font-mono text-slate-500 md:flex">
            <span>PING: 14ms</span>
            <span>VER: v2.4.0</span>
          </div>
          <Link
            href="/app"
            className="group relative inline-flex h-9 items-center gap-2 overflow-hidden border border-emerald-500/30 bg-emerald-500/10 px-5 font-display text-xs font-bold uppercase tracking-wider text-emerald-400 backdrop-blur-sm transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-500/20"
          >
            <span className="relative z-10 flex items-center gap-2">
              Enter Workspace <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </span>
            <span className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto grid min-h-[calc(100vh-100px)] max-w-7xl items-center gap-12 py-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 border border-blue-500/20 bg-blue-500/5 px-3 py-1 rounded-full text-xs font-mono tracking-wide text-blue-400">
              <Sparkles size={12} className="animate-pulse" />
              <span>THE PRODUCTION AI ENVIRONMENT</span>
            </div>
            <h1 className="font-display text-5xl font-bold leading-[1.08] tracking-tight text-slate-100 md:text-7xl">
              Construct, Test & Evaluate{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500 bg-clip-text text-transparent">
                Prompt Systems
              </span>
            </h1>
            <p className="max-w-xl text-md leading-relaxed text-slate-400">
              A military-grade IDE and operations cockpit built for prompt compilers, agentic swarms, semantic indexers, vector memory cache networks, and structured evaluation guardrails.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/app"
              className="inline-flex h-11 items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 px-6 font-display text-sm font-semibold tracking-wide text-black transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] rounded-sm"
            >
              Initialize Control Plane
            </Link>
            <a
              href="#simulator"
              className="inline-flex h-11 items-center justify-center gap-2 border border-slate-700 bg-slate-900/30 px-6 text-sm font-medium text-slate-300 backdrop-blur-sm transition-all hover:border-slate-500 hover:bg-slate-900/60 rounded-sm"
            >
              View IDE Compiler
            </a>
          </div>

          {/* Quick telemetry badges */}
          <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-8">
            <div>
              <div className="font-display text-xl font-bold text-slate-200">100%</div>
              <div className="font-mono text-[10px] tracking-wider text-slate-500 uppercase">Deterministic Outputs</div>
            </div>
            <div>
              <div className="font-display text-xl font-bold text-slate-200">&lt;50ms</div>
              <div className="font-mono text-[10px] tracking-wider text-slate-500 uppercase">Embedding Latency</div>
            </div>
            <div>
              <div className="font-display text-xl font-bold text-slate-200">256-bit</div>
              <div className="font-mono text-[10px] tracking-wider text-slate-500 uppercase">Vector Cryptography</div>
            </div>
          </div>
        </div>

        {/* Interactive Prompt IDE Simulator */}
        <div id="simulator" className="relative flex flex-col rounded-md glass-panel border-white/10 shadow-2xl overflow-hidden min-h-[500px]">
          {/* Header */}
          <div className="flex h-12 items-center justify-between border-b border-white/5 bg-slate-950/80 px-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/60 border border-rose-500/20" />
              <span className="h-3 w-3 rounded-full bg-amber-500/60 border border-amber-500/20" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/60 border border-emerald-500/20" />
              <span className="ml-2 font-mono text-xs text-slate-400">prompt_compiler_ide.ts</span>
            </div>
            <div className="flex items-center gap-1 border border-white/5 bg-slate-900/60 p-0.5 rounded-sm">
              <button
                onClick={() => setActiveTab("router")}
                className={`px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider uppercase rounded-sm transition-all ${
                  activeTab === "router"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Router
              </button>
              <button
                onClick={() => setActiveTab("planner")}
                className={`px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider uppercase rounded-sm transition-all ${
                  activeTab === "planner"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Planner
              </button>
              <button
                onClick={() => setActiveTab("guardrail")}
                className={`px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider uppercase rounded-sm transition-all ${
                  activeTab === "guardrail"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Guardrail
              </button>
            </div>
          </div>

          {/* IDE Main Workspace */}
          <div className="grid flex-1 divide-y divide-white/5 md:grid-cols-2 md:divide-x md:divide-y-0">
            {/* Left side - Config & Inputs */}
            <div className="flex flex-col p-4 space-y-4 bg-slate-950/40">
              <div className="space-y-1">
                <span className="font-mono text-[10px] tracking-wider text-slate-500 uppercase">System Prompt</span>
                <div className="font-mono text-xs border border-white/5 bg-slate-950/80 p-3 text-slate-300 rounded-sm leading-relaxed overflow-hidden">
                  <span className="code-token-keyword">system_directive</span>: <span className="code-token-string">&quot;{activeTemplate.systemPrompt}&quot;</span>
                </div>
              </div>

              <div className="space-y-1 flex-1 flex flex-col">
                <span className="font-mono text-[10px] tracking-wider text-slate-500 uppercase">User Variable Context</span>
                <div className="flex-1 font-mono text-xs border border-white/5 bg-slate-950/80 p-3 text-emerald-400 rounded-sm leading-relaxed overflow-hidden flex flex-col justify-between">
                  <div>
                    <span className="code-token-keyword">var</span> user_query = <span className="code-token-string">&quot;{activeTemplate.userPrompt}&quot;</span>;
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-4 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1"><Cpu size={10} /> model: gemini-2.5-pro</span>
                    <span>tokens: {activeTemplate.tokens}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Simulator Execution Outputs */}
            <div className="flex flex-col bg-slate-950/20 p-4 space-y-4">
              {/* Telemetry output */}
              <div className="grid grid-cols-3 gap-2">
                <div className="border border-white/5 bg-slate-950/50 p-2.5 rounded-sm">
                  <div className="font-mono text-[9px] tracking-wider text-slate-500 uppercase">Latency</div>
                  <div className="font-display font-semibold text-xs text-slate-200 mt-0.5">{activeTemplate.latency}</div>
                </div>
                <div className="border border-white/5 bg-slate-950/50 p-2.5 rounded-sm">
                  <div className="font-mono text-[9px] tracking-wider text-slate-500 uppercase">Cost (Est)</div>
                  <div className="font-display font-semibold text-xs text-slate-200 mt-0.5">{activeTemplate.cost}</div>
                </div>
                <div className="border border-white/5 bg-slate-950/50 p-2.5 rounded-sm">
                  <div className="font-mono text-[9px] tracking-wider text-slate-500 uppercase">Eval Score</div>
                  <div className="font-display font-semibold text-xs text-emerald-400 mt-0.5">{activeTemplate.accuracy}</div>
                </div>
              </div>

              {/* Console window */}
              <div className="flex-1 flex flex-col border border-white/5 bg-slate-950/90 rounded-sm overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/5 bg-slate-950 px-3 py-1.5">
                  <span className="font-mono text-[9px] tracking-wider text-slate-500 uppercase flex items-center gap-1">
                    <Terminal size={10} /> Compiler Console
                  </span>
                  {isCompiling ? (
                    <span className="flex items-center gap-1.5 font-mono text-[9px] text-emerald-400">
                      <span className="h-1 w-1 bg-emerald-400 rounded-full animate-ping" />
                      COMPILING
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 font-mono text-[9px] text-blue-400">
                      <CheckCircle2 size={8} /> STABLE
                    </span>
                  )}
                </div>

                <div className="flex-1 p-3 font-mono text-[11px] space-y-2 overflow-y-auto max-h-[180px]">
                  {/* Logs list */}
                  {compilerLogs.map((log, index) => (
                    <div key={index} className="text-slate-500 leading-normal">
                      {log}
                    </div>
                  ))}

                  {/* Render output screen */}
                  {!isCompiling && simulatedOutput && (
                    <div className="border-t border-white/5 pt-2 mt-2">
                      <span className="text-slate-400 block mb-1">[output] LLM Response:</span>
                      <pre className="text-emerald-400 bg-emerald-950/10 p-2 border border-emerald-500/10 rounded-sm overflow-x-auto whitespace-pre-wrap leading-normal">
                        {simulatedOutput}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Vector Embeddings Grid Graph */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[9px] font-mono uppercase text-slate-500 tracking-wider">
                  <span>Context Vector Space Map</span>
                  <span>Density: {(activeTemplate.vectorDensity.reduce((a,b)=>a+b, 0)/12).toFixed(2)}</span>
                </div>
                <div className="h-5 flex items-end gap-[3px] px-1 border border-white/5 bg-slate-950/60 rounded-sm overflow-hidden py-0.5">
                  {activeTemplate.vectorDensity.map((val, idx) => (
                    <div
                      key={idx}
                      className="flex-1 bg-gradient-to-t from-emerald-500/20 to-emerald-400 transition-all duration-700"
                      style={{ height: `${isCompiling ? 5 : val * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capability Grid Overhaul */}
      <section className="mx-auto max-w-7xl py-16 border-t border-white/5 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-200">
            Engineered Core Architecture
          </h2>
          <p className="max-w-2xl mx-auto text-sm text-slate-400">
            An production operational stack that decouples prompt schemas, runs automated evaluations, and scales agent states.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              label: "Prompt University",
              desc: "Deep-dives into prompt structures, few-shot compilation, and AST variable mappings.",
              icon: GraduationCap,
              color: "text-emerald-400",
              border: "hover:border-emerald-500/30"
            },
            {
              label: "Prompt IDE",
              desc: "Hot-reloading execution environments with inline evaluations and vector embedding metrics.",
              icon: Workflow,
              color: "text-blue-400",
              border: "hover:border-blue-500/30"
            },
            {
              label: "Agent Builder",
              desc: "Construct stateful, multi-agent workflows with local database and tool-calling execution rings.",
              icon: Boxes,
              color: "text-amber-400",
              border: "hover:border-amber-500/30"
            },
            {
              label: "Context Engineers",
              desc: "Automated retrieval-augmented structures mapping user request arrays to database clusters.",
              icon: Layers,
              color: "text-violet-400",
              border: "hover:border-violet-500/30"
            },
            {
              label: "Vector Memory Cache",
              desc: "Blazing fast semantic cache layers storing active workspace context in local Redis clusters.",
              icon: Database,
              color: "text-rose-400",
              border: "hover:border-rose-500/30"
            },
            {
              label: "Enterprise Governance",
              desc: "Standardized token controls, security guardrails, toxic filtering, and complete billing telemetry.",
              icon: Shield,
              color: "text-teal-400",
              border: "hover:border-teal-500/30"
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`group relative flex flex-col justify-between rounded-md glass-panel p-6 transition-all duration-300 glass-panel-hover cursor-pointer border-white/5 ${item.border}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Icon className={`${item.color} transition-transform group-hover:scale-110`} size={24} />
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-800 group-hover:bg-emerald-400 transition-colors" />
                  </div>
                  <h3 className="mt-4 font-display font-semibold text-slate-200 text-md">{item.label}</h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-4 flex items-center justify-end">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 group-hover:text-[var(--accent)] transition-colors flex items-center gap-1">
                    Deploy System <ArrowRight size={10} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tech Stack Telemetry Matrix */}
      <section className="mx-auto max-w-7xl py-12 border-t border-white/5 flex flex-col gap-6 md:flex-row md:items-center md:justify-between text-slate-500 font-mono text-[10px] tracking-widest uppercase">
        <div className="flex items-center gap-2">
          <Database size={12} className="text-slate-400" />
          <span>Integrations Telemetry Matrix</span>
        </div>
        <div className="flex flex-wrap gap-6">
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 bg-emerald-400 rounded-full status-pulse" />
            Qdrant Vector: ONLINE
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 bg-emerald-400 rounded-full status-pulse" />
            Redis Cache: ONLINE
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 bg-emerald-400 rounded-full status-pulse" />
            Postgres Meta: CONNECTED
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 bg-emerald-400 rounded-full status-pulse" />
            Meilisearch: IDLE
          </span>
        </div>
      </section>
    </main>
  );
}
