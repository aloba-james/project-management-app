"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/stores/workspace-store";

/** Dedicated create route — opens the create dialog on the dashboard. */
export default function NewWorkspacePage() {
  const router = useRouter();
  const setCreateDialogOpen = useWorkspaceStore((s) => s.setCreateDialogOpen);

  useEffect(() => {
    setCreateDialogOpen(true);
    router.replace("/");
  }, [router, setCreateDialogOpen]);

  return (
    <div className="p-8 text-sm text-muted-foreground">Opening create…</div>
  );
}
