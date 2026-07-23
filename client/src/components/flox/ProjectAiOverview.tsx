"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { FloxProject } from "@/types/project";

type Props = {
  workspaceId: string;
  project: FloxProject;
  className?: string;
};

function healthLabel(progress: number, status: string) {
  if (status === "Blocked") return { label: "At risk", tone: "text-destructive" };
  if (status === "OnHold") return { label: "Paused", tone: "text-muted-foreground" };
  if (status === "Completed") return { label: "Complete", tone: "text-foreground" };
  if (progress >= 70) return { label: "Healthy", tone: "text-foreground" };
  if (progress >= 40) return { label: "On track", tone: "text-foreground" };
  return { label: "Early", tone: "text-muted-foreground" };
}

/**
 * AI-generated project overview — health, summary, recommendation.
 */
export function ProjectAiOverview({ workspaceId, project, className }: Props) {
  const health = healthLabel(project.progress, project.status);
  const recommendation =
    project.status === "Blocked"
      ? "Unblock the critical path before adding more scope."
      : project.progress < 30
        ? "Establish folders and core documents, then lock the timeline."
        : "Keep momentum on open documents and review blockers.";

  return (
    <section className={cn("border-b pb-8", className)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Overview
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            {project.name}
          </h1>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Health
          </p>
          <p className={cn("text-2xl font-semibold", health.tone)}>
            {project.progress}%
          </p>
          <p className="text-sm text-muted-foreground">{health.label}</p>
        </div>
      </div>

      <dl className="mt-8 grid gap-6 sm:grid-cols-3">
        <div>
          <dt className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Status
          </dt>
          <dd className="mt-1 text-sm font-medium">{project.status}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Timeline
          </dt>
          <dd className="mt-1 text-sm font-medium">{project.progress}%</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Type
          </dt>
          <dd className="mt-1 text-sm font-medium">{project.projectType}</dd>
        </div>
      </dl>

      <div className="mt-8 max-w-2xl">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Summary
        </p>
        <p className="mt-2 text-base leading-relaxed">
          {project.aiSummary ||
            project.description ||
            "Flox will refresh this summary as files and folders evolve."}
        </p>
      </div>

      <div className="mt-6 max-w-2xl">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Recommendation
        </p>
        <p className="mt-2 text-sm leading-relaxed">{recommendation}</p>
      </div>

      <nav className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t pt-4 text-sm">
        {(
          [
            ["Overview", `#overview`],
            ["Files", `#files`],
            ["Folders", `#folders`],
            ["AI", `/brain?workspaceId=${workspaceId}`],
          ] as const
        ).map(([label, href]) =>
          href.startsWith("#") ? (
            <a
              key={label}
              href={href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </a>
          ) : (
            <Link
              key={label}
              href={href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          ),
        )}
      </nav>
    </section>
  );
}
