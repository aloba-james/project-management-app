"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useCreateFile, useFiles } from "@/hooks/useFiles";

type Props = {
  workspaceId: string;
  projectId: string;
};

export function ProjectFilesPanel({ workspaceId, projectId }: Props) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { data: files = [], isLoading } = useFiles({ workspaceId, projectId });
  const create = useCreateFile();

  const handleCreate = async () => {
    setError(null);
    if (!name.trim()) {
      setError("File name is required");
      return;
    }
    try {
      await create.mutateAsync({
        workspaceId,
        projectId,
        name: name.trim().includes(".") ? name.trim() : `${name.trim()}.md`,
        contentText: content,
        fileKind: "Markdown",
      });
      setName("");
      setContent("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create file");
    }
  };

  return (
    <section className="mt-8">
      <div>
        <h2 className="text-lg font-semibold">Files</h2>
        <p className="text-sm text-muted-foreground">
          Intelligent knowledge objects with AI summaries and versions.
        </p>
      </div>

      <div className="mt-4 space-y-3 rounded-xl border p-4">
        <div className="space-y-2">
          <Label htmlFor="file-name">New file</Label>
          <Input
            id="file-name"
            placeholder="proposal.md"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="file-content">Content (optional)</Label>
          <Textarea
            id="file-content"
            placeholder="Paste or write file content…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />
        </div>
        <Button
          className="gap-2"
          onClick={() => void handleCreate()}
          disabled={create.isPending}
        >
          <Plus className="h-4 w-4" />
          Create file
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <ul className="mt-4 divide-y rounded-xl border">
        {isLoading ? (
          <li className="px-4 py-6 text-sm text-muted-foreground">Loading…</li>
        ) : files.length === 0 ? (
          <li className="px-4 py-6 text-sm text-muted-foreground">
            No files yet. Create a markdown file to get an AI summary.
          </li>
        ) : (
          files.map((f) => (
            <li
              key={f.id}
              className="flex items-start justify-between gap-3 px-4 py-3"
            >
              <div className="min-w-0">
                <Link
                  href={`/workspaces/${workspaceId}/projects/${projectId}/files/${f.id}`}
                  className="inline-flex items-center gap-2 font-medium hover:underline"
                >
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  {f.name}
                </Link>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {f.aiSummary || f.description || "No summary yet"}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <div className="flex gap-1">
                  <Badge variant="secondary">{f.fileKind}</Badge>
                  <Badge variant="outline">v{f.version}</Badge>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {f.size} bytes
                </span>
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
