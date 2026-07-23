"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateObject, useObjects } from "@/hooks/useObjects";
import type { ObjectType } from "@/types/object";

const QUICK_TYPES: ObjectType[] = [
  "Project",
  "Folder",
  "Task",
  "File",
  "Meeting",
  "Knowledge",
  "Prompt",
  "Template",
];

type Props = {
  workspaceId: string;
};

export function WorkspaceObjectsSection({ workspaceId }: Props) {
  const [name, setName] = useState("");
  const [objectType, setObjectType] = useState<ObjectType>("Project");
  const [error, setError] = useState<string | null>(null);
  const { data: objects = [], isLoading } = useObjects({ workspaceId });
  const create = useCreateObject();

  const handleCreate = async () => {
    setError(null);
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    try {
      await create.mutateAsync({
        workspaceId,
        name: name.trim(),
        objectType,
        status: "Active",
      });
      setName("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create object");
    }
  };

  return (
    <section className="mt-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Objects</h2>
          <p className="text-sm text-muted-foreground">
            Everything in this workspace is an object.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <Label htmlFor="obj-name">Quick create</Label>
          <Input
            id="obj-name"
            placeholder="Object name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="w-full space-y-2 sm:w-44">
          <Label>Type</Label>
          <Select
            value={objectType}
            onValueChange={(v) => setObjectType(v as ObjectType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {QUICK_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          disabled={create.isPending}
          onClick={() => void handleCreate()}
        >
          {create.isPending ? "Creating…" : "Create"}
        </Button>
      </div>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

      <ul className="mt-4 divide-y rounded-lg border">
        {isLoading ? (
          <li className="px-4 py-6 text-sm text-muted-foreground">Loading…</li>
        ) : objects.length === 0 ? (
          <li className="px-4 py-6 text-sm text-muted-foreground">
            No objects yet. Create one above.
          </li>
        ) : (
          objects.slice(0, 12).map((obj) => (
            <li key={obj.id}>
              <Link
                href={`/workspaces/${workspaceId}/objects/${obj.id}`}
                className="flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-accent/40"
              >
                <div>
                  <p className="font-medium">{obj.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {obj.objectType} · {obj.status}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(obj.updatedAt).toLocaleDateString()}
                </span>
              </Link>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
