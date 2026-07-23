export type ObjectType =
  | "Workspace"
  | "Project"
  | "Folder"
  | "File"
  | "Task"
  | "Meeting"
  | "Prompt"
  | "Template"
  | "Knowledge"
  | "Person"
  | "Company"
  | "Repository"
  | "Workflow"
  | "Automation"
  | "Image"
  | "Video"
  | "Spreadsheet"
  | "Presentation"
  | "Database"
  | "Website"
  | "API";

export type ObjectStatus =
  | "Draft"
  | "Active"
  | "Archived"
  | "Deleted"
  | "Completed"
  | "InReview"
  | "Pending"
  | "Cancelled";

export type ObjectRelationshipType =
  | "belongs_to"
  | "references"
  | "generated_from"
  | "contains"
  | "depends_on"
  | "blocks"
  | "related_to"
  | "assigned_to"
  | "uses_template"
  | "attached_to"
  | "derived_from";

export type ObjectActivityType =
  | "Created"
  | "Updated"
  | "Archived"
  | "Deleted"
  | "Shared"
  | "Referenced"
  | "Viewed"
  | "Downloaded"
  | "AiGenerated";

export type ObjectPermissionAction =
  | "View"
  | "Comment"
  | "Edit"
  | "Delete"
  | "Share"
  | "Move"
  | "Archive";

export type FloxObject = {
  id: string;
  workspaceId: string;
  objectType: ObjectType;
  name: string;
  description: string | null;
  status: ObjectStatus;
  createdBy: number;
  updatedBy: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  aiSummary: string | null;
  tags: string[];
  metadata: Record<string, unknown>;
};

export type ObjectActivity = {
  id: number;
  activityType: ObjectActivityType;
  metadata: unknown;
  createdAt: string;
  user: { userId: number; username: string } | null;
};

export type ObjectPermission = {
  id: number;
  userId: number;
  actions: string[];
  user: {
    userId: number;
    username: string;
    email: string | null;
    profilePictureUrl: string | null;
  };
};

export type ObjectRelationshipEdge = {
  id: number;
  relationshipType: ObjectRelationshipType;
  createdAt: string;
  target?: FloxObject;
  source?: FloxObject;
};

export type FloxObjectDetail = FloxObject & {
  relationships: {
    outbound: ObjectRelationshipEdge[];
    inbound: ObjectRelationshipEdge[];
  };
  activities: ObjectActivity[];
  permissions: ObjectPermission[];
};

export type CreateObjectPayload = {
  workspaceId: string;
  objectType: ObjectType;
  name: string;
  description?: string | null;
  status?: ObjectStatus;
  tags?: string[];
  metadata?: Record<string, unknown>;
};

export type UpdateObjectPayload = {
  name?: string;
  description?: string | null;
  status?: ObjectStatus;
  tags?: string[];
  metadata?: Record<string, unknown>;
  aiSummary?: string | null;
};
