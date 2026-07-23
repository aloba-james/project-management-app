"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  useAiSuggestions,
  useCreateWorkspace,
} from "@/hooks/useWorkspaces";
import type { WorkspaceSuggestion, WorkspaceType } from "@/types/workspace";
import { Sparkles } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

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

export function CreateWorkspaceDialog({ open, onOpenChange }: Props) {
  const create = useCreateWorkspace();
  const ai = useAiSuggestions();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [workspaceType, setWorkspaceType] =
    useState<WorkspaceType>("Personal");
  const [aiPrompt, setAiPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<WorkspaceSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setName("");
    setDescription("");
    setWorkspaceType("Personal");
    setAiPrompt("");
    setSuggestions([]);
    setError(null);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleGenerate = async () => {
    setError(null);
    if (!name.trim()) {
      setError("Enter a workspace name first");
      return;
    }
    try {
      const res = await ai.mutateAsync({
        name,
        description,
        prompt: aiPrompt,
      });
      setSuggestions(res.suggestions);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate suggestions");
    }
  };

  const handleCreate = async () => {
    setError(null);
    try {
      await create.mutateAsync({
        name: name.trim(),
        description: description.trim() || null,
        workspaceType,
        aiPrompt: aiPrompt.trim() || null,
      });
      handleOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create workspace");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create workspace</DialogTitle>
          <DialogDescription>
            Name your workspace, optionally generate AI suggestions to review,
            then create. Nothing is auto-created from suggestions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="ws-name">Name</Label>
            <Input
              id="ws-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme Product"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ws-desc">Description</Label>
            <Textarea
              id="ws-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this workspace for?"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={workspaceType}
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
            <Label htmlFor="ws-ai">AI prompt (optional)</Label>
            <Textarea
              id="ws-ai"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. SaaS marketing team launching Q3 campaigns"
              rows={2}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={ai.isPending}
              onClick={() => void handleGenerate()}
            >
              <Sparkles className="h-4 w-4" />
              {ai.isPending ? "Generating…" : "Generate suggestions"}
            </Button>
          </div>

          {suggestions.length > 0 && (
            <div className="space-y-2 rounded-lg border bg-muted/40 p-3">
              <p className="text-sm font-medium">Review suggestions</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {suggestions.map((s) => (
                  <li key={s.id} className="rounded-md border bg-background p-2">
                    <span className="font-medium text-foreground">
                      [{s.kind}] {s.title}
                    </span>
                    <p className="text-xs">{s.description}</p>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground">
                These are recommendations only — create the workspace, then add
                projects yourself.
              </p>
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!name.trim() || create.isPending}
            onClick={() => void handleCreate()}
          >
            {create.isPending ? "Creating…" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
