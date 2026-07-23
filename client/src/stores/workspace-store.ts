import { create } from "zustand";
import { persist } from "zustand/middleware";

type WorkspaceUiState = {
  activeWorkspaceId: string | null;
  createDialogOpen: boolean;
  searchQuery: string;
  setActiveWorkspaceId: (id: string | null) => void;
  setCreateDialogOpen: (open: boolean) => void;
  setSearchQuery: (q: string) => void;
};

export const useWorkspaceStore = create<WorkspaceUiState>()(
  persist(
    (set) => ({
      activeWorkspaceId: null,
      createDialogOpen: false,
      searchQuery: "",
      setActiveWorkspaceId: (id) => set({ activeWorkspaceId: id }),
      setCreateDialogOpen: (open) => set({ createDialogOpen: open }),
      setSearchQuery: (q) => set({ searchQuery: q }),
    }),
    { name: "aklist-workspace-ui" },
  ),
);
