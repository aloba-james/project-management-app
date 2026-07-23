export type FolderStatus =
  | "Active"
  | "Archived"
  | "Locked"
  | "Hidden"
  | "Deleted";

export type FolderType =
  | "General"
  | "Development"
  | "Design"
  | "Marketing"
  | "Finance"
  | "Legal"
  | "HR"
  | "Research"
  | "Sales"
  | "Operations"
  | "Knowledge"
  | "Archive"
  | "Assets"
  | "Templates"
  | "Custom";

export type FloxFolder = {
  id: string;
  workspaceId: string;
  projectId: string;
  parentFolderId: string | null;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  status: FolderStatus;
  folderType: FolderType;
  ownerId: number;
  aiSummary: string | null;
  metadata: unknown;
  isFavorite: boolean;
  isPinned: boolean;
  isLocked: boolean;
  objectId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  childCount?: number;
  objectCount?: number;
  children?: FloxFolder[];
};

export type CreateFolderPayload = {
  workspaceId: string;
  projectId: string;
  parentFolderId?: string | null;
  name: string;
  description?: string | null;
  folderType?: FolderType;
  icon?: string | null;
  color?: string | null;
};

export type FolderSuggestion = {
  name: string;
  folderType: FolderType;
  children?: FolderSuggestion[];
};
