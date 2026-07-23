"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import type { WorkspaceDetail } from "@/types/workspace";
import type { FloxProject } from "@/types/project";

type Props = {
  workspace: WorkspaceDetail;
  projects: FloxProject[];
};

/**
 * AI briefing strip for workspace home — what matters, what changed, what next.
 */
export function WorkspaceBriefing({ workspace, projects }: Props) {
  const active = projects.filter(
    (p) => p.status === "Active" || p.status === "Planning",
  );
  const needsAttention = projects.filter(
    (p) => p.status === "Blocked" || p.status === "OnHold",
  );
  const top = active[0] ?? projects[0];

  const bullets = useMemo(() => {
    const items: string[] = [];
    if (active.length) {
      items.push(
        `${active.length} active project${active.length === 1 ? "" : "s"} in flight`,
      );
    }
    if (needsAttention.length) {
      items.push(
        `${needsAttention.length} project${needsAttention.length === 1 ? "" : "s"} need attention`,
      );
    }
    if (workspace.recentActivity?.[0]) {
      const a = workspace.recentActivity[0];
      items.push(
        `Latest: ${a.action.replace(/\./g, " ")} · ${a.user?.username ?? "System"}`,
      );
    } else {
      items.push("No recent activity yet — set a goal to begin.");
    }
    if (top?.aiSummary) {
      items.push(top.aiSummary.slice(0, 140) + (top.aiSummary.length > 140 ? "…" : ""));
    }
    return items.slice(0, 5);
  }, [active.length, needsAttention.length, workspace.recentActivity, top]);

  const recommendation = needsAttention[0]
    ? `Review ${needsAttention[0].name} — status is ${needsAttention[0].status}.`
    : top
      ? `Continue ${top.name} today.`
      : "Describe a goal below to let Flox build the first project.";

  const hour = new Date().getHours();
  const hello =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <section className="border-b pb-8">
      <p className="text-sm text-muted-foreground">
        {hello}
        {workspace.name ? `.` : "."}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
        {workspace.name}
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
        {workspace.description?.trim() ||
          (top
            ? `${top.name} is the focus right now.`
            : "This workspace is ready. Tell Flox what to accomplish.")}
      </p>

      <ul className="mt-6 space-y-2 text-sm">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="text-muted-foreground">•</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-sm">
        <span className="text-muted-foreground">Recommendation: </span>
        {recommendation}
      </p>

      {top && (
        <Link
          href={`/workspaces/${workspace.id}/projects/${top.id}`}
          className="mt-4 inline-block text-sm font-medium underline-offset-4 hover:underline"
        >
          Open {top.name}
        </Link>
      )}
    </section>
  );
}
