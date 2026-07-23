"use client";

import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useObjectSearch } from "@/hooks/useObjects";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useWorkspaceStore } from "@/stores/workspace-store";
import type { ObjectType } from "@/types/object";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const TYPE_FILTERS: Array<ObjectType | "All"> = [
  "All",
  "Project",
  "Task",
  "Folder",
  "File",
  "Meeting",
  "Knowledge",
  "Prompt",
  "Template",
  "Person",
];

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [objectType, setObjectType] = useState<ObjectType | "All">("All");
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const { data: workspaces = [] } = useWorkspaces({ status: "Active" });
  const workspaceId = activeWorkspaceId ?? workspaces[0]?.id;

  const {
    data: objects = [],
    isLoading,
    isError,
    error,
  } = useObjectSearch({
    workspaceId,
    q: debouncedTerm,
    objectType: objectType === "All" ? undefined : objectType,
    enabled: debouncedTerm.length >= 1,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    if (query) {
      setSearchTerm(query);
      setDebouncedTerm(query.trim());
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="p-8">
      <Header name="Search" />
      <p className="mb-4 max-w-xl text-sm text-muted-foreground">
        Universal object search
        {workspaceId
          ? ` in ${workspaces.find((w) => w.id === workspaceId)?.name ?? "workspace"}`
          : " — open a workspace first"}
        .
      </p>
      <Input
        type="text"
        placeholder="Search objects…"
        className="max-w-xl"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        disabled={!workspaceId}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {TYPE_FILTERS.map((t) => (
          <Button
            key={t}
            type="button"
            size="sm"
            variant={objectType === t ? "default" : "outline"}
            onClick={() => setObjectType(t)}
          >
            {t}
          </Button>
        ))}
      </div>

      <div className="mt-6 max-w-2xl space-y-2">
        {!workspaceId && (
          <p className="text-sm text-muted-foreground">
            No active workspace.{" "}
            <Link href="/" className="underline">
              Go to workspaces
            </Link>
          </p>
        )}
        {isLoading && <p className="text-sm text-muted-foreground">Searching…</p>}
        {isError && (
          <p className="text-sm text-destructive">
            {(error as Error)?.message || "Search failed"}
          </p>
        )}
        {!isLoading &&
          !isError &&
          debouncedTerm.length >= 1 &&
          objects.length === 0 && (
            <p className="text-sm text-muted-foreground">No objects found.</p>
          )}
        {objects.map((obj) => (
          <Link
            key={obj.id}
            href={`/workspaces/${obj.workspaceId}/objects/${obj.id}`}
          >
            <Card className="mb-2 transition-colors hover:bg-accent/40">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base">{obj.name}</CardTitle>
                <div className="flex gap-1.5">
                  <Badge variant="secondary">{obj.objectType}</Badge>
                  <Badge variant="outline">{obj.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {obj.aiSummary || obj.description || "No description"}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Search;
