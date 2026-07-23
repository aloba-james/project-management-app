"use client";

import { use } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteObject, useObject } from "@/hooks/useObjects";
import { useRouter } from "next/navigation";

export default function ObjectDetailPage({
  params,
}: {
  params: Promise<{ id: string; objectId: string }>;
}) {
  const { id: workspaceId, objectId } = use(params);
  const { data: object, isLoading, isError, error } = useObject(objectId);
  const remove = useDeleteObject();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 p-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !object) {
    return (
      <div className="p-8 text-destructive">
        {(error as Error)?.message || "Object not found"}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6 md:p-8">
      <Button variant="ghost" size="sm" asChild className="mb-4 px-0">
        <Link href={`/workspaces/${workspaceId}`}>← Back to workspace</Link>
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {object.name}
            </h1>
            <Badge variant="secondary">{object.objectType}</Badge>
            <Badge variant="outline">{object.status}</Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {object.description || "No description"}
          </p>
          {object.aiSummary && (
            <p className="mt-3 rounded-lg border bg-muted/40 p-3 text-sm">
              {object.aiSummary}
            </p>
          )}
        </div>
        <Button
          variant="destructive"
          size="sm"
          disabled={remove.isPending}
          onClick={() =>
            void remove.mutateAsync(object.id).then(() =>
              router.push(`/workspaces/${workspaceId}`),
            )
          }
        >
          Delete
        </Button>
      </div>

      {object.tags?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {object.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <section className="mt-8">
        <h2 className="text-sm font-medium text-muted-foreground">Metadata</h2>
        <pre className="mt-2 overflow-x-auto rounded-lg border bg-muted/30 p-3 text-xs">
          {JSON.stringify(object.metadata ?? {}, null, 2)}
        </pre>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Relationships</h2>
        <ul className="mt-3 divide-y rounded-lg border text-sm">
          {(() => {
            const items = [
              ...(object.relationships?.outbound ?? []).map((r) => ({
                key: `out-${r.id}`,
                label: `${r.relationshipType} → ${r.target?.name ?? "?"} (${r.target?.objectType})`,
              })),
              ...(object.relationships?.inbound ?? []).map((r) => ({
                key: `in-${r.id}`,
                label: `${r.source?.name ?? "?"} (${r.source?.objectType}) → ${r.relationshipType}`,
              })),
            ];
            if (items.length === 0) {
              return (
                <li className="px-4 py-6 text-muted-foreground">
                  No relationships yet.
                </li>
              );
            }
            return items.map((item) => (
              <li key={item.key} className="px-4 py-3">
                {item.label}
              </li>
            ));
          })()}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Activity</h2>
        <ul className="mt-3 divide-y rounded-lg border text-sm">
          {object.activities?.length ? (
            object.activities.map((a) => (
              <li key={a.id} className="px-4 py-3">
                <span className="font-medium">{a.activityType}</span>
                <span className="text-muted-foreground">
                  {" "}
                  · {a.user?.username ?? "System"} ·{" "}
                  {new Date(a.createdAt).toLocaleString()}
                </span>
              </li>
            ))
          ) : (
            <li className="px-4 py-6 text-muted-foreground">No activity yet.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
