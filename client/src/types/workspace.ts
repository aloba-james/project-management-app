export type WorkspaceType =
  | "Personal"
  | "Business"
  | "Startup"
  | "Software"
  | "Healthcare"
  | "Education"
  | "Marketing"
  | "Research"
  | "Finance"
  | "Legal"
  | "Custom";

export type WorkspacePlan = "Free" | "Pro" | "Enterprise";
export type WorkspaceStatus = "Active" | "Archived" | "Deleted";
export type WorkspaceMemberRole =
  | "Owner"
  | "Admin"
  | "Manager"
  | "Editor"
  | "Viewer"
  | "Guest";

export type Workspace = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  icon: string | null;
  workspaceType: WorkspaceType;
  industry: string | null;
  website: string | null;
  country: string | null;
  timezone: string | null;
  language: string | null;
  plan: WorkspacePlan;
  status: WorkspaceStatus;
  storageLimit: number;
  storageUsed: number;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  role?: WorkspaceMemberRole;
  memberCount?: number;
  projectCount?: number;
};

export type WorkspaceMember = {
  id: number;
  workspaceId: string;
  userId: number;
  role: WorkspaceMemberRole;
  joinedAt: string;
  user: {
    userId: number;
    username: string;
    email: string | null;
    profilePictureUrl: string | null;
  };
};

export type WorkspaceActivity = {
  id: number;
  action: string;
  createdAt: string;
  metadata: string | null;
  user: { userId: number; username: string } | null;
};

export type WorkspaceDetail = Workspace & {
  members: WorkspaceMember[];
  recentActivity: WorkspaceActivity[];
};

export type WorkspaceSuggestion = {
  id: string;
  kind: "project" | "folder" | "setting";
  title: string;
  description: string;
};

export type CreateWorkspacePayload = {
  name: string;
  description?: string | null;
  workspaceType?: WorkspaceType;
  industry?: string | null;
  website?: string | null;
  country?: string | null;
  timezone?: string | null;
  language?: string | null;
  icon?: string | null;
  logoUrl?: string | null;
  aiPrompt?: string | null;
};

export type UpdateWorkspacePayload = Partial<
  Omit<CreateWorkspacePayload, "aiPrompt">
>;
