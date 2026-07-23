"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";

type HealthItem = {
  name: string;
  layer: string;
  status: "live" | "stub" | "degraded";
  ok: boolean;
  detail?: string;
};

type HealthResponse = {
  ok: boolean;
  architecture: string;
  checkedAt: string;
  services: HealthItem[];
};

const LAYERS = [
  {
    id: "presentation",
    title: "Presentation",
    path: "app/, components/",
    note: "React UI only",
  },
  {
    id: "application",
    title: "Application",
    path: "app/api/v1/**",
    note: "Auth, Zod, DTO → services",
  },
  {
    id: "domain",
    title: "Domain",
    path: "domain/",
    note: "Workspace, Object, Project/Task adapters",
  },
  {
    id: "ai",
    title: "AI",
    path: "ai/",
    note: "Brain Gateway, Planner, Execution, Tool Hub, Knowledge Graph",
  },
  {
    id: "infrastructure",
    title: "Infrastructure",
    path: "infra/",
    note: "Postgres live; cache/storage stubs",
  },
  {
    id: "platform",
    title: "Platform",
    path: "platform/",
    note: "Event bus, workspace-scope, errors",
  },
];

function statusClass(status: HealthItem["status"]) {
  if (status === "live") return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (status === "stub") return "bg-amber-100 text-amber-900 border-amber-200";
  return "bg-red-100 text-red-800 border-red-200";
}

export default function ArchitecturePage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/v1/architecture/health");
        if (!res.ok) throw new Error(`Health check failed (${res.status})`);
        const data = (await res.json()) as HealthResponse;
        if (!cancelled) setHealth(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load health");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-4xl p-6 md:p-8">
      <Header name="Architecture" />
      <p className="mb-8 max-w-2xl text-sm text-muted-foreground">
        Flox runs as an in-process modular monolith. Services expose clear
        boundaries; Redis, S3, and search queues remain stubs until later
        phases. Brain execute always requires an Approved execution plan.
      </p>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold tracking-tight">Layers</h2>
        <ul className="space-y-3">
          {LAYERS.map((layer) => (
            <li key={layer.id} className="border-b border-border/60 pb-3">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-medium">{layer.title}</span>
                <code className="text-xs text-muted-foreground">{layer.path}</code>
              </div>
              <p className="text-sm text-muted-foreground">{layer.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold tracking-tight">
            Service health
          </h2>
          {health && (
            <Badge variant={health.ok ? "secondary" : "destructive"}>
              {health.architecture}
            </Badge>
          )}
        </div>

        {loading && (
          <p className="text-sm text-muted-foreground">Checking adapters…</p>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}

        {health && (
          <>
            <p className="mb-4 text-xs text-muted-foreground">
              Checked {new Date(health.checkedAt).toLocaleString()}
            </p>
            <ul className="space-y-2">
              {health.services.map((s) => (
                <li
                  key={`${s.layer}-${s.name}`}
                  className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 py-2"
                >
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {s.layer}
                      {s.detail ? ` · ${s.detail}` : ""}
                    </div>
                  </div>
                  <span
                    className={`rounded border px-2 py-0.5 text-xs font-medium capitalize ${statusClass(s.status)}`}
                  >
                    {s.status}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
