"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  useDuplicateFile,
  useFile,
  useRewriteFile,
  useSummarizeFile,
  useUpdateFile,
} from "@/hooks/useFiles";

export default function FileDetailPage({
  params,
}: {
  params: Promise<{ id: string; projectId: string; fileId: string }>;
}) {
  const { id: workspaceId, projectId, fileId } = use(params);
  const { data: file, isLoading, isError, error } = useFile(fileId);
  const update = useUpdateFile(fileId);
  const summarize = useSummarizeFile();
  const rewrite = useRewriteFile();
  const duplicate = useDuplicateFile();
  const [draft, setDraft] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !file) {
    return (
      <div className="p-8 text-destructive">
        {(error as Error)?.message || "File not found"}
      </div>
    );
  }

  const content = draft ?? file.contentText ?? "";
  const entities = Array.isArray(file.entities)
    ? (file.entities as Array<{ type: string; value: string }>)
    : [];

  const save = async () => {
    setMsg(null);
    try {
      await update.mutateAsync({
        contentText: content,
        changeSummary: "Edited in file view",
      });
      setDraft(null);
      setMsg("Saved (new version created)");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Save failed");
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6 md:p-8">
      <Button variant="ghost" size="sm" className="mb-4 gap-2" asChild>
        <Link href={`/workspaces/${workspaceId}/projects/${projectId}`}>
          <ArrowLeft className="h-4 w-4" />
          Back to project
        </Link>
      </Button>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">{file.name}</h1>
            <Badge variant="secondary">{file.fileKind}</Badge>
            <Badge variant="outline">{file.status}</Badge>
            <Badge variant="outline">v{file.version}</Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {file.description || "Intelligent file knowledge object"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="secondary"
            disabled={summarize.isPending}
            onClick={() => void summarize.mutateAsync(file.id)}
          >
            Summarize
          </Button>
          <Button
            size="sm"
            variant="secondary"
            disabled={rewrite.isPending}
            onClick={() =>
              void rewrite.mutateAsync({
                id: file.id,
                instruction: "Improve clarity",
              })
            }
          >
            Rewrite
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={duplicate.isPending}
            onClick={() => void duplicate.mutateAsync(file.id)}
          >
            Duplicate
          </Button>
        </div>
      </div>

      <section className="mt-6 rounded-xl border p-4">
        <h2 className="text-sm font-medium text-muted-foreground">AI view</h2>
        <p className="mt-2 text-sm leading-relaxed">
          {file.aiSummary || "Run Summarize to generate an AI summary."}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {file.topics.map((t) => (
            <Badge key={t} variant="outline">
              {t}
            </Badge>
          ))}
          {file.aiKeywords.slice(0, 8).map((k) => (
            <Badge key={k} variant="secondary">
              {k}
            </Badge>
          ))}
        </div>
        {entities.length > 0 && (
          <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
            {entities.map((e, i) => (
              <li key={`${e.type}-${e.value}-${i}`}>
                {e.type}: {e.value}
              </li>
            ))}
          </ul>
        )}
        {file.purpose && (
          <p className="mt-3 text-sm">
            <span className="text-muted-foreground">Purpose: </span>
            {file.purpose}
          </p>
        )}
      </section>

      <section className="mt-6 space-y-2">
        <Label htmlFor="file-editor">Content</Label>
        <Textarea
          id="file-editor"
          rows={14}
          value={content}
          onChange={(e) => setDraft(e.target.value)}
          className="font-mono text-sm"
        />
        <div className="flex items-center gap-3">
          <Button onClick={() => void save()} disabled={update.isPending}>
            Save version
          </Button>
          {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Version history</h2>
        <ul className="mt-3 divide-y rounded-xl border">
          {(file.versions ?? []).length === 0 ? (
            <li className="px-4 py-4 text-sm text-muted-foreground">
              No versions listed.
            </li>
          ) : (
            (file.versions ?? []).map((v) => (
              <li
                key={v.id}
                className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
              >
                <div>
                  <span className="font-medium">v{v.version}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    · {v.source} · {v.editor?.username ?? "System"} ·{" "}
                    {new Date(v.createdAt).toLocaleString()}
                  </span>
                  {v.changeSummary && (
                    <p className="text-xs text-muted-foreground">
                      {v.changeSummary}
                    </p>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Relationships</h2>
        <ul className="mt-3 divide-y rounded-xl border">
          {(file.relationships?.outbound ?? []).length === 0 &&
          (file.relationships?.inbound ?? []).length === 0 ? (
            <li className="px-4 py-4 text-sm text-muted-foreground">
              No relationships yet. Link via object graph APIs.
            </li>
          ) : (
            <>
              {(file.relationships?.outbound ?? []).map((r) => (
                <li key={`out-${r.id}`} className="px-4 py-3 text-sm">
                  {r.relationshipType} → {r.target.name} ({r.target.objectType})
                </li>
              ))}
              {(file.relationships?.inbound ?? []).map((r) => (
                <li key={`in-${r.id}`} className="px-4 py-3 text-sm">
                  {r.source.name} ({r.source.objectType}) → {r.relationshipType}
                </li>
              ))}
            </>
          )}
        </ul>
      </section>
    </div>
  );
}
