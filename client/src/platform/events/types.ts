/** Immutable platform event names (ARCH-001 + FR-002/FR-003). */
export const PlatformEvents = {
  WorkspaceCreated: "WorkspaceCreated",
  WorkspaceUpdated: "WorkspaceUpdated",
  WorkspaceArchived: "WorkspaceArchived",
  WorkspaceDeleted: "WorkspaceDeleted",
  WorkspaceRestored: "WorkspaceRestored",
  ObjectCreated: "ObjectCreated",
  ObjectUpdated: "ObjectUpdated",
  ObjectDeleted: "ObjectDeleted",
  ProjectCreated: "ProjectCreated",
  ProjectUpdated: "ProjectUpdated",
  ProjectArchived: "ProjectArchived",
  ProjectDeleted: "ProjectDeleted",
  ProjectCompleted: "ProjectCompleted",
  ProjectRestored: "ProjectRestored",
  ProjectDuplicated: "ProjectDuplicated",
  ProjectBlueprintApplied: "ProjectBlueprintApplied",
  FolderCreated: "FolderCreated",
  FolderUpdated: "FolderUpdated",
  FolderMoved: "FolderMoved",
  FolderDeleted: "FolderDeleted",
  FolderArchived: "FolderArchived",
  FolderRestored: "FolderRestored",
  FolderRenamed: "FolderRenamed",
  FolderDuplicated: "FolderDuplicated",
  FileCreated: "FileCreated",
  FileUpdated: "FileUpdated",
  FileArchived: "FileArchived",
  FileDeleted: "FileDeleted",
  FileRestored: "FileRestored",
  FileDuplicated: "FileDuplicated",
  FileShared: "FileShared",
  VersionCreated: "VersionCreated",
  SummaryUpdated: "SummaryUpdated",
  EmbeddingUpdated: "EmbeddingUpdated",
  RelationshipUpdated: "RelationshipUpdated",
  KnowledgeExtracted: "KnowledgeExtracted",
  PromptExecuted: "PromptExecuted",
  ExecutionStarted: "ExecutionStarted",
  ExecutionCompleted: "ExecutionCompleted",
  ExecutionFailed: "ExecutionFailed",
  PlanCreated: "PlanCreated",
  PlanUpdated: "PlanUpdated",
  PlanApproved: "PlanApproved",
  PlanRejected: "PlanRejected",
  PlanStarted: "PlanStarted",
  PlanCompleted: "PlanCompleted",
  PlanFailed: "PlanFailed",
  TaskAssigned: "TaskAssigned",
  NotificationSent: "NotificationSent",
} as const;

export type PlatformEventName =
  (typeof PlatformEvents)[keyof typeof PlatformEvents];

export type PlatformEvent<T = unknown> = {
  readonly type: PlatformEventName | string;
  readonly workspaceId: string;
  readonly payload: T;
  readonly executionId?: string | null;
  readonly occurredAt: string;
};
