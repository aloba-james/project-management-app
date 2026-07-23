export type FileStatus =
  | "Draft"
  | "Active"
  | "Archived"
  | "Locked"
  | "Deleted";

export type FileKind =
  | "Markdown"
  | "Word"
  | "Excel"
  | "PowerPoint"
  | "PDF"
  | "Image"
  | "Video"
  | "Audio"
  | "CSV"
  | "JSON"
  | "YAML"
  | "XML"
  | "TXT"
  | "HTML"
  | "React"
  | "Python"
  | "Java"
  | "Go"
  | "Rust"
  | "SQL"
  | "Canvas"
  | "Whiteboard"
  | "DatabaseSchema"
  | "Other";

export type FloxFile = {
  id: string;
  workspaceId: string;
  projectId: string;
  folderId: string | null;
  objectId: string | null;
  name: string;
  extension: string;
  mimeType: string;
  fileKind: FileKind;
  description: string | null;
  status: FileStatus;
  ownerId: number;
  size: number;
  checksum: string | null;
  language: string | null;
  encoding: string | null;
  version: number;
  storageLocation: string | null;
  contentText: string | null;
  aiSummary: string | null;
  aiKeywords: string[];
  topics: string[];
  intent: string | null;
  purpose: string | null;
  entities: unknown;
  confidenceScore: number | null;
  generationSource: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  isLocked: boolean;
  metadata: unknown;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  versionCount?: number;
  owner?: {
    userId: number;
    username: string;
    email: string | null;
    profilePictureUrl: string | null;
  };
  versions?: FileVersion[];
  relationships?: {
    outbound: Array<{
      id: number;
      relationshipType: string;
      target: { id: string; name: string; objectType: string };
    }>;
    inbound: Array<{
      id: number;
      relationshipType: string;
      source: { id: string; name: string; objectType: string };
    }>;
  };
};

export type FileVersion = {
  id: string;
  fileId: string;
  version: number;
  contentText: string | null;
  size: number;
  changeSummary: string | null;
  source: string;
  createdAt: string;
  editor?: { userId: number; username: string } | null;
};

export type CreateFilePayload = {
  workspaceId: string;
  projectId: string;
  folderId?: string | null;
  name: string;
  contentText?: string | null;
  description?: string | null;
  fileKind?: FileKind;
  purpose?: string | null;
};
