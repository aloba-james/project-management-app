export type ProjectStatus =
  | "Draft"
  | "Planning"
  | "Active"
  | "OnHold"
  | "Blocked"
  | "Completed"
  | "Cancelled"
  | "Archived"
  | "Deleted";

export type ProjectType =
  | "Software"
  | "Marketing"
  | "Research"
  | "Healthcare"
  | "Sales"
  | "Finance"
  | "HR"
  | "Construction"
  | "Legal"
  | "Education"
  | "Operations"
  | "Startup"
  | "Personal"
  | "Custom";

export type ProjectVisibility =
  | "Private"
  | "Workspace"
  | "PublicLink"
  | "Restricted";

export type ProjectPriority = "Low" | "Medium" | "High" | "Critical";

export type FloxProject = {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  description: string | null;
  status: ProjectStatus;
  priority: ProjectPriority;
  visibility: ProjectVisibility;
  ownerId: number;
  projectType: ProjectType;
  industry: string | null;
  budget: number | null;
  currency: string | null;
  startDate: string | null;
  dueDate: string | null;
  completedDate: string | null;
  progress: number;
  color: string | null;
  icon: string | null;
  coverImage: string | null;
  aiSummary: string | null;
  metadata: unknown;
  modules: unknown;
  objectId: string | null;
  /** Linked Express task board id (Int) */
  boardProjectId: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  folderCount?: number;
  owner?: {
    userId: number;
    username: string;
    email: string | null;
    profilePictureUrl: string | null;
  };
};

export type CreateProjectPayload = {
  workspaceId: string;
  name: string;
  description?: string | null;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  visibility?: ProjectVisibility;
  projectType?: ProjectType;
  industry?: string | null;
  blueprint?: "Software" | "Healthcare" | "none";
};

export type UpdateProjectPayload = Partial<
  Omit<CreateProjectPayload, "workspaceId" | "blueprint">
> & {
  progress?: number;
  aiSummary?: string | null;
  modules?: Record<string, boolean>;
};
