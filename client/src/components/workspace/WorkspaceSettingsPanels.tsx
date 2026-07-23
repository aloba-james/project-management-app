"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useArchiveWorkspace,
  useDeleteWorkspace,
  useRestoreWorkspace,
  useUpdateWorkspace,
} from "@/hooks/useWorkspaces";
import { DeleteWorkspaceDialog } from "./DeleteWorkspaceDialog";
import type { WorkspaceDetail, WorkspaceType } from "@/types/workspace";
import { useRouter } from "next/navigation";

const TYPES: WorkspaceType[] = [
  "Personal",
  "Business",
  "Startup",
  "Software",
  "Healthcare",
  "Education",
  "Marketing",
  "Research",
  "Finance",
  "Legal",
  "Custom",
];

type Props = {
  workspace: WorkspaceDetail;
};

export function WorkspaceSettingsPanels({ workspace }: Props) {
  const router = useRouter();
  const update = useUpdateWorkspace(workspace.id);
  const archive = useArchiveWorkspace();
  const restore = useRestoreWorkspace();
  const remove = useDeleteWorkspace();

  const [name, setName] = useState(workspace.name);
  const [description, setDescription] = useState(workspace.description ?? "");
  const [workspaceType, setWorkspaceType] = useState<WorkspaceType>(
    workspace.workspaceType,
  );
  const [industry, setIndustry] = useState(workspace.industry ?? "");
  const [website, setWebsite] = useState(workspace.website ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    setName(workspace.name);
    setDescription(workspace.description ?? "");
    setWorkspaceType(workspace.workspaceType);
    setIndustry(workspace.industry ?? "");
    setWebsite(workspace.website ?? "");
  }, [workspace]);

  const readOnly = workspace.status !== "Active";
  const usedPct = Math.min(
    100,
    Math.round((workspace.storageUsed / Math.max(workspace.storageLimit, 1)) * 100),
  );

  const saveGeneral = async () => {
    setError(null);
    setMessage(null);
    try {
      await update.mutateAsync({
        name: name.trim(),
        description: description.trim() || null,
        workspaceType,
        industry: industry.trim() || null,
        website: website.trim() || null,
      });
      setMessage("Saved");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    }
  };

  return (
    <>
      <Tabs defaultValue="general" className="mt-6">
        <TabsList className="flex h-auto flex-wrap justify-start gap-1">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="ai">AI</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-4 max-w-xl">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={name}
              disabled={readOnly}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              disabled={readOnly}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={workspaceType}
              disabled={readOnly}
              onValueChange={(v) => setWorkspaceType(v as WorkspaceType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Industry</Label>
            <Input
              value={industry}
              disabled={readOnly}
              onChange={(e) => setIndustry(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Website</Label>
            <Input
              value={website}
              disabled={readOnly}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://"
            />
          </div>
          {readOnly && (
            <p className="text-sm text-amber-700 dark:text-amber-300">
              This workspace is {workspace.status.toLowerCase()} and read-only.
              Restore it to make changes.
            </p>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          {message && <p className="text-sm text-emerald-600">{message}</p>}
          <Button
            disabled={readOnly || update.isPending}
            onClick={() => void saveGeneral()}
          >
            {update.isPending ? "Saving…" : "Save changes"}
          </Button>
        </TabsContent>

        <TabsContent value="members" className="mt-6">
          <ul className="divide-y rounded-lg border">
            {workspace.members.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium">{m.user.username}</p>
                  <p className="text-muted-foreground">
                    {m.user.email || "No email"}
                  </p>
                </div>
                <span className="text-muted-foreground">{m.role}</span>
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="storage" className="mt-6 max-w-md space-y-3">
          <p className="text-sm text-muted-foreground">
            {formatBytes(workspace.storageUsed)} of{" "}
            {formatBytes(workspace.storageLimit)} used ({usedPct}%)
          </p>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-foreground/80 transition-all"
              style={{ width: `${usedPct}%` }}
            />
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="mt-6 max-w-lg space-y-2 text-sm text-muted-foreground">
          <p>
            Owners and Admins can edit workspace settings, archive, and delete.
          </p>
          <p>Editors and below can view the workspace; project access follows
            existing project membership (Express APIs).</p>
        </TabsContent>

        <TabsContent value="ai" className="mt-6 max-w-lg space-y-2 text-sm text-muted-foreground">
          <p>
            AI suggestions are rule-based stubs for now. They never auto-create
            projects or folders — you review and act manually.
          </p>
        </TabsContent>

        <TabsContent value="danger" className="mt-6 max-w-lg space-y-4">
          {workspace.status === "Active" && (
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Archive workspace</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Archived workspaces become read-only.
              </p>
              <Button
                variant="outline"
                className="mt-3"
                disabled={archive.isPending}
                onClick={() =>
                  void archive.mutateAsync(workspace.id).then(() =>
                    router.refresh(),
                  )
                }
              >
                Archive
              </Button>
            </div>
          )}

          {(workspace.status === "Archived" ||
            workspace.status === "Deleted") && (
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Restore workspace</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Bring this workspace back to Active.
              </p>
              <Button
                className="mt-3"
                disabled={restore.isPending}
                onClick={() =>
                  void restore.mutateAsync(workspace.id).then(() =>
                    router.push(`/workspaces/${workspace.id}`),
                  )
                }
              >
                Restore
              </Button>
            </div>
          )}

          {workspace.status !== "Deleted" && (
            <div className="rounded-lg border border-destructive/40 p-4">
              <h3 className="font-medium text-destructive">Delete workspace</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Soft-delete. You can restore later.
              </p>
              <Button
                variant="destructive"
                className="mt-3"
                onClick={() => setDeleteOpen(true)}
              >
                Delete
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <DeleteWorkspaceDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        workspaceName={workspace.name}
        isPending={remove.isPending}
        onConfirm={() =>
          void remove.mutateAsync(workspace.id).then(() => {
            setDeleteOpen(false);
            router.push("/");
          })
        }
      />
    </>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}
