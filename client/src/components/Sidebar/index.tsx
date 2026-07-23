"use client";

import { useAppSelector } from "@/app/redux";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  BrainCircuit,
  Briefcase,
  Calendar,
  FileText,
  FolderKanban,
  Home,
  LayoutGrid,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { useProjects } from "@/hooks/useProjects";

/**
 * OS-style shell nav — supporting views, not the product center.
 * Intent lives in the Goal bar.
 */
const Sidebar = () => {
  const { data: workspaces = [] } = useWorkspaces({ status: "Active" });
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const setActiveWorkspaceId = useWorkspaceStore((s) => s.setActiveWorkspaceId);
  const activeWorkspace =
    workspaces.find((w) => w.id === activeWorkspaceId) ?? workspaces[0];
  const { data: projects = [] } = useProjects({
    workspaceId: activeWorkspace?.id,
  });
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  const wsHref = activeWorkspace
    ? `/workspaces/${activeWorkspace.id}`
    : "/";
  const firstProject = projects[0];
  const boardHref =
    activeWorkspace && firstProject
      ? `/workspaces/${activeWorkspace.id}/projects/${firstProject.id}/board`
      : wsHref;

  return (
    <aside
      className={cn(
        "fixed z-40 flex h-full flex-col border-r bg-card transition-all duration-300",
        isSidebarCollapsed ? "hidden w-0" : "w-64",
      )}
    >
      <div className="flex min-h-[56px] items-center px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Flox
        </Link>
      </div>

      <div className="border-y px-6 py-4">
        <p className="truncate text-sm font-medium">
          {activeWorkspace?.name ?? "No workspace"}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          AI workspace OS
        </p>
      </div>

      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-0.5 py-2">
          <SidebarLink icon={Home} label="Home" href={wsHref} />
          <SidebarLink icon={FolderKanban} label="Projects" href={wsHref} />
          <SidebarLink icon={FileText} label="Documents" href="/search" />
          <SidebarLink icon={Sparkles} label="Knowledge" href="/search" />
          <SidebarLink icon={BrainCircuit} label="AI" href="/brain" />
          <SidebarLink icon={Search} label="Search" href="/search" />
        </nav>

        <Separator className="my-2" />
        <p className="px-6 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Work views
        </p>
        <nav className="flex flex-col gap-0.5 pb-2">
          <SidebarLink icon={Briefcase} label="Timeline / Gantt" href="/timeline" />
          <SidebarLink icon={Calendar} label="Calendar" href="/calendar" />
          <SidebarLink
            icon={LayoutGrid}
            label="Board (drag & drop)"
            href={boardHref}
          />
          <SidebarLink icon={Settings} label="Settings" href="/settings" />
        </nav>

        {workspaces.length > 0 && (
          <>
            <Separator className="my-2" />
            <p className="px-6 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Workspaces
            </p>
            <div className="flex flex-col gap-0.5 pb-2">
              {workspaces.slice(0, 8).map((ws) => (
                <SidebarLink
                  key={ws.id}
                  icon={Home}
                  label={ws.name}
                  href={`/workspaces/${ws.id}`}
                  onNavigate={() => setActiveWorkspaceId(ws.id)}
                />
              ))}
            </div>
          </>
        )}

        {projects.length > 0 && activeWorkspace && (
          <>
            <Separator className="my-2" />
            <p className="px-6 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Projects
            </p>
            <div className="flex flex-col gap-0.5 pb-2">
              {projects.slice(0, 10).map((p) => (
                <SidebarLink
                  key={p.id}
                  icon={FolderKanban}
                  label={p.name}
                  href={`/workspaces/${activeWorkspace.id}/projects/${p.id}`}
                />
              ))}
            </div>
            <p className="px-6 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Task boards
            </p>
            <div className="flex flex-col gap-0.5 pb-4">
              {projects.slice(0, 10).map((p) => (
                <SidebarLink
                  key={`${p.id}-board`}
                  icon={LayoutGrid}
                  label={p.name}
                  href={`/workspaces/${activeWorkspace.id}/projects/${p.id}/board`}
                />
              ))}
            </div>
          </>
        )}
      </ScrollArea>

      <div className="border-t px-6 py-4 text-xs text-muted-foreground">
        Navigate by goal — use the bar below.
      </div>
    </aside>
  );
};

interface SidebarLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
  onNavigate?: () => void;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  onNavigate,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href ||
    (href !== "/" && pathname.startsWith(href + "/"));

  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "relative h-auto w-full justify-start gap-3 rounded-none px-6 py-2.5 font-medium",
        isActive && "bg-accent text-accent-foreground",
      )}
    >
      <Link href={href} onClick={onNavigate}>
        {isActive && (
          <span className="absolute left-0 top-0 h-full w-1 rounded-r bg-foreground" />
        )}
        <Icon
          className={cn(
            "h-4 w-4",
            isActive ? "text-foreground" : "text-muted-foreground",
          )}
        />
        <span className="truncate">{label}</span>
      </Link>
    </Button>
  );
};

export default Sidebar;
