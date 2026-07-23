"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Folder, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { folderApi } from "@/services/folder.service";
import {
  useApplyFolderSuggestions,
  useCreateFolder,
  useFolders,
  useSuggestFolders,
} from "@/hooks/useFolders";
import type { FolderSuggestion, FloxFolder } from "@/types/folder";

type Props = {
  workspaceId: string;
  projectId: string;
};

export function ProjectFoldersPanel({ workspaceId, projectId }: Props) {
  const [name, setName] = useState("");
  const [suggestPrompt, setSuggestPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<FolderSuggestion[] | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const { data: folders = [], isLoading } = useFolders({
    workspaceId,
    projectId,
    rootOnly: true,
  });
  const create = useCreateFolder();
  const suggest = useSuggestFolders();
  const apply = useApplyFolderSuggestions();

  const handleCreate = async () => {
    setError(null);
    if (!name.trim()) {
      setError("Folder name is required");
      return;
    }
    try {
      await create.mutateAsync({
        workspaceId,
        projectId,
        name: name.trim(),
      });
      setName("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create folder");
    }
  };

  const handleSuggest = async () => {
    setError(null);
    if (!suggestPrompt.trim()) {
      setError("Describe the folder structure you want");
      return;
    }
    try {
      const res = await suggest.mutateAsync({
        workspaceId,
        projectId,
        prompt: suggestPrompt.trim(),
      });
      setSuggestions(res.suggestions);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Suggestion failed");
    }
  };

  const handleApply = async () => {
    if (!suggestions?.length) return;
    setError(null);
    try {
      await apply.mutateAsync({
        workspaceId,
        projectId,
        folders: suggestions,
      });
      setSuggestions(null);
      setSuggestPrompt("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to apply suggestions");
    }
  };

  return (
    <section className="mt-8">
      <div>
        <h2 className="text-lg font-semibold">Folders</h2>
        <p className="text-sm text-muted-foreground">
          Nested context containers for this project.
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <Label htmlFor="folder-name">New root folder</Label>
          <Input
            id="folder-name"
            placeholder="Folder name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <Button
          className="gap-2"
          onClick={() => void handleCreate()}
          disabled={create.isPending}
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      <div className="mt-3 space-y-3 rounded-xl border p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="folder-suggest">Smart folder suggestions</Label>
            <Input
              id="folder-suggest"
              placeholder="e.g. Create Marketing Folder"
              value={suggestPrompt}
              onChange={(e) => setSuggestPrompt(e.target.value)}
            />
          </div>
          <Button
            variant="secondary"
            className="gap-2"
            onClick={() => void handleSuggest()}
            disabled={suggest.isPending}
          >
            <Sparkles className="h-4 w-4" />
            Suggest
          </Button>
        </div>
        {suggestions && (
          <div className="rounded-lg bg-muted/40 p-3 text-sm">
            <p className="mb-2 font-medium">Preview</p>
            <ul className="space-y-1">
              {suggestions.map((s) => (
                <li key={s.name}>
                  {s.name}
                  {s.children?.length ? (
                    <ul className="ml-4 list-disc text-muted-foreground">
                      {s.children.map((c) => (
                        <li key={c.name}>{c.name}</li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
            <Button
              className="mt-3"
              size="sm"
              onClick={() => void handleApply()}
              disabled={apply.isPending}
            >
              Apply structure
            </Button>
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

      <ul className="mt-4 divide-y rounded-xl border">
        {isLoading ? (
          <li className="px-4 py-6 text-sm text-muted-foreground">Loading…</li>
        ) : folders.length === 0 ? (
          <li className="px-4 py-6 text-sm text-muted-foreground">
            No folders yet. Use a blueprint or create one manually.
          </li>
        ) : (
          folders.map((f) => (
            <li key={f.id} className="px-4 py-3">
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{f.name}</span>
                <Badge variant="secondary">{f.folderType}</Badge>
                <Badge variant="outline">{f.status}</Badge>
                <span className="ml-auto text-xs text-muted-foreground">
                  {f.childCount ?? 0} subfolders
                </span>
              </div>
              <FolderChildren
                workspaceId={workspaceId}
                projectId={projectId}
                parentFolderId={f.id}
              />
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

function FolderChildren(props: {
  workspaceId: string;
  projectId: string;
  parentFolderId: string;
}) {
  const { data: folders = [] } = useQuery({
    queryKey: ["flox-folders", "children", props.parentFolderId],
    queryFn: () =>
      folderApi.list({
        workspaceId: props.workspaceId,
        projectId: props.projectId,
        parentFolderId: props.parentFolderId,
      }),
    select: (data: { folders: FloxFolder[] }) => data.folders,
  });

  if (!folders.length) return null;

  return (
    <ul className="mt-2 ml-6 space-y-1 border-l pl-3">
      {folders.map((c) => (
        <li key={c.id} className="flex items-center gap-2 text-sm">
          <Folder className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{c.name}</span>
          <Badge variant="outline" className="text-[10px]">
            {c.folderType}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
