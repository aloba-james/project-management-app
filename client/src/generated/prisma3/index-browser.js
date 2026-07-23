
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  userId: 'userId',
  cognitoId: 'cognitoId',
  username: 'username',
  profilePictureUrl: 'profilePictureUrl',
  email: 'email',
  teamId: 'teamId'
};

exports.Prisma.TeamScalarFieldEnum = {
  id: 'id',
  teamName: 'teamName',
  productOwnerUserId: 'productOwnerUserId',
  projectManagerUserId: 'projectManagerUserId'
};

exports.Prisma.ProjectScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  startDate: 'startDate',
  endDate: 'endDate',
  workspaceId: 'workspaceId'
};

exports.Prisma.ProjectTeamScalarFieldEnum = {
  id: 'id',
  teamId: 'teamId',
  projectId: 'projectId'
};

exports.Prisma.TaskScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  status: 'status',
  priority: 'priority',
  tags: 'tags',
  startDate: 'startDate',
  dueDate: 'dueDate',
  points: 'points',
  projectId: 'projectId',
  authorUserId: 'authorUserId',
  assignedUserId: 'assignedUserId'
};

exports.Prisma.TaskAssignmentScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  taskId: 'taskId'
};

exports.Prisma.AttachmentScalarFieldEnum = {
  id: 'id',
  fileURL: 'fileURL',
  fileName: 'fileName',
  taskId: 'taskId',
  uploadedById: 'uploadedById'
};

exports.Prisma.CommentScalarFieldEnum = {
  id: 'id',
  text: 'text',
  taskId: 'taskId',
  userId: 'userId'
};

exports.Prisma.WorkspaceScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  logoUrl: 'logoUrl',
  icon: 'icon',
  workspaceType: 'workspaceType',
  industry: 'industry',
  website: 'website',
  country: 'country',
  timezone: 'timezone',
  language: 'language',
  plan: 'plan',
  status: 'status',
  storageLimit: 'storageLimit',
  storageUsed: 'storageUsed',
  ownerId: 'ownerId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.FloxProjectScalarFieldEnum = {
  id: 'id',
  workspaceId: 'workspaceId',
  name: 'name',
  slug: 'slug',
  description: 'description',
  status: 'status',
  priority: 'priority',
  visibility: 'visibility',
  ownerId: 'ownerId',
  projectType: 'projectType',
  industry: 'industry',
  budget: 'budget',
  currency: 'currency',
  startDate: 'startDate',
  dueDate: 'dueDate',
  completedDate: 'completedDate',
  progress: 'progress',
  color: 'color',
  icon: 'icon',
  coverImage: 'coverImage',
  aiSummary: 'aiSummary',
  metadata: 'metadata',
  modules: 'modules',
  objectId: 'objectId',
  boardProjectId: 'boardProjectId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.FloxFolderScalarFieldEnum = {
  id: 'id',
  workspaceId: 'workspaceId',
  projectId: 'projectId',
  parentFolderId: 'parentFolderId',
  name: 'name',
  slug: 'slug',
  description: 'description',
  icon: 'icon',
  color: 'color',
  status: 'status',
  folderType: 'folderType',
  ownerId: 'ownerId',
  aiSummary: 'aiSummary',
  metadata: 'metadata',
  isFavorite: 'isFavorite',
  isPinned: 'isPinned',
  isLocked: 'isLocked',
  objectId: 'objectId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.FloxFileScalarFieldEnum = {
  id: 'id',
  workspaceId: 'workspaceId',
  projectId: 'projectId',
  folderId: 'folderId',
  objectId: 'objectId',
  name: 'name',
  extension: 'extension',
  mimeType: 'mimeType',
  fileKind: 'fileKind',
  description: 'description',
  status: 'status',
  ownerId: 'ownerId',
  size: 'size',
  checksum: 'checksum',
  language: 'language',
  encoding: 'encoding',
  version: 'version',
  storageLocation: 'storageLocation',
  thumbnail: 'thumbnail',
  coverImage: 'coverImage',
  contentText: 'contentText',
  aiSummary: 'aiSummary',
  aiKeywords: 'aiKeywords',
  topics: 'topics',
  intent: 'intent',
  purpose: 'purpose',
  entities: 'entities',
  confidenceScore: 'confidenceScore',
  generationSource: 'generationSource',
  promptId: 'promptId',
  executionPlanId: 'executionPlanId',
  isFavorite: 'isFavorite',
  isPinned: 'isPinned',
  isLocked: 'isLocked',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.FloxFileVersionScalarFieldEnum = {
  id: 'id',
  fileId: 'fileId',
  version: 'version',
  contentText: 'contentText',
  storageLocation: 'storageLocation',
  size: 'size',
  checksum: 'checksum',
  changeSummary: 'changeSummary',
  editorId: 'editorId',
  source: 'source',
  createdAt: 'createdAt'
};

exports.Prisma.FloxObjectScalarFieldEnum = {
  id: 'id',
  workspaceId: 'workspaceId',
  folderId: 'folderId',
  objectType: 'objectType',
  name: 'name',
  description: 'description',
  status: 'status',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt',
  aiSummary: 'aiSummary',
  tags: 'tags',
  metadata: 'metadata'
};

exports.Prisma.ObjectRelationshipScalarFieldEnum = {
  id: 'id',
  workspaceId: 'workspaceId',
  sourceObjectId: 'sourceObjectId',
  targetObjectId: 'targetObjectId',
  relationshipType: 'relationshipType',
  createdAt: 'createdAt'
};

exports.Prisma.ObjectActivityScalarFieldEnum = {
  id: 'id',
  objectId: 'objectId',
  workspaceId: 'workspaceId',
  userId: 'userId',
  activityType: 'activityType',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.ObjectPermissionScalarFieldEnum = {
  id: 'id',
  objectId: 'objectId',
  userId: 'userId',
  actions: 'actions',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WorkspaceMemberScalarFieldEnum = {
  id: 'id',
  workspaceId: 'workspaceId',
  userId: 'userId',
  role: 'role',
  joinedAt: 'joinedAt'
};

exports.Prisma.WorkspaceAuditLogScalarFieldEnum = {
  id: 'id',
  workspaceId: 'workspaceId',
  userId: 'userId',
  action: 'action',
  ip: 'ip',
  device: 'device',
  browser: 'browser',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.BrainExecutionScalarFieldEnum = {
  id: 'id',
  workspaceId: 'workspaceId',
  userId: 'userId',
  prompt: 'prompt',
  intent: 'intent',
  plan: 'plan',
  contextSnapshot: 'contextSnapshot',
  agent: 'agent',
  modelProvider: 'modelProvider',
  modelId: 'modelId',
  toolsUsed: 'toolsUsed',
  result: 'result',
  resultObjectIds: 'resultObjectIds',
  tokenUsage: 'tokenUsage',
  costCents: 'costCents',
  error: 'error',
  durationMs: 'durationMs',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BrainMemoryScalarFieldEnum = {
  id: 'id',
  workspaceId: 'workspaceId',
  userId: 'userId',
  key: 'key',
  value: 'value',
  scope: 'scope',
  ownerKey: 'ownerKey',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BrainEventScalarFieldEnum = {
  id: 'id',
  workspaceId: 'workspaceId',
  executionId: 'executionId',
  type: 'type',
  payload: 'payload',
  createdAt: 'createdAt'
};

exports.Prisma.ExecutionPlanScalarFieldEnum = {
  id: 'id',
  workspaceId: 'workspaceId',
  userId: 'userId',
  prompt: 'prompt',
  goal: 'goal',
  summary: 'summary',
  intent: 'intent',
  complexity: 'complexity',
  strategy: 'strategy',
  estimatedDuration: 'estimatedDuration',
  estimatedTokens: 'estimatedTokens',
  estimatedCost: 'estimatedCost',
  status: 'status',
  approvalRequired: 'approvalRequired',
  dependencies: 'dependencies',
  warnings: 'warnings',
  requiredAgents: 'requiredAgents',
  requiredModels: 'requiredModels',
  requiredTools: 'requiredTools',
  requiredObjects: 'requiredObjects',
  selectedObjectIds: 'selectedObjectIds',
  rootObjectId: 'rootObjectId',
  brainExecutionId: 'brainExecutionId',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ExecutionPlanStepScalarFieldEnum = {
  id: 'id',
  planId: 'planId',
  order: 'order',
  title: 'title',
  description: 'description',
  agent: 'agent',
  tool: 'tool',
  model: 'model',
  status: 'status',
  estimatedTime: 'estimatedTime',
  estimatedCost: 'estimatedCost',
  retryCount: 'retryCount',
  maxRetries: 'maxRetries',
  dependsOn: 'dependsOn',
  outputObjects: 'outputObjects',
  approvalRequired: 'approvalRequired',
  error: 'error',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.WorkspaceType = exports.$Enums.WorkspaceType = {
  Personal: 'Personal',
  Business: 'Business',
  Startup: 'Startup',
  Software: 'Software',
  Healthcare: 'Healthcare',
  Education: 'Education',
  Marketing: 'Marketing',
  Research: 'Research',
  Finance: 'Finance',
  Legal: 'Legal',
  Custom: 'Custom'
};

exports.WorkspacePlan = exports.$Enums.WorkspacePlan = {
  Free: 'Free',
  Pro: 'Pro',
  Enterprise: 'Enterprise'
};

exports.WorkspaceStatus = exports.$Enums.WorkspaceStatus = {
  Active: 'Active',
  Archived: 'Archived',
  Deleted: 'Deleted'
};

exports.ProjectStatus = exports.$Enums.ProjectStatus = {
  Draft: 'Draft',
  Planning: 'Planning',
  Active: 'Active',
  OnHold: 'OnHold',
  Blocked: 'Blocked',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
  Archived: 'Archived',
  Deleted: 'Deleted'
};

exports.ProjectPriority = exports.$Enums.ProjectPriority = {
  Low: 'Low',
  Medium: 'Medium',
  High: 'High',
  Critical: 'Critical'
};

exports.ProjectVisibility = exports.$Enums.ProjectVisibility = {
  Private: 'Private',
  Workspace: 'Workspace',
  PublicLink: 'PublicLink',
  Restricted: 'Restricted'
};

exports.ProjectType = exports.$Enums.ProjectType = {
  Software: 'Software',
  Marketing: 'Marketing',
  Research: 'Research',
  Healthcare: 'Healthcare',
  Sales: 'Sales',
  Finance: 'Finance',
  HR: 'HR',
  Construction: 'Construction',
  Legal: 'Legal',
  Education: 'Education',
  Operations: 'Operations',
  Startup: 'Startup',
  Personal: 'Personal',
  Custom: 'Custom'
};

exports.FolderStatus = exports.$Enums.FolderStatus = {
  Active: 'Active',
  Archived: 'Archived',
  Locked: 'Locked',
  Hidden: 'Hidden',
  Deleted: 'Deleted'
};

exports.FolderType = exports.$Enums.FolderType = {
  General: 'General',
  Development: 'Development',
  Design: 'Design',
  Marketing: 'Marketing',
  Finance: 'Finance',
  Legal: 'Legal',
  HR: 'HR',
  Research: 'Research',
  Sales: 'Sales',
  Operations: 'Operations',
  Knowledge: 'Knowledge',
  Archive: 'Archive',
  Assets: 'Assets',
  Templates: 'Templates',
  Custom: 'Custom'
};

exports.FileKind = exports.$Enums.FileKind = {
  Markdown: 'Markdown',
  Word: 'Word',
  Excel: 'Excel',
  PowerPoint: 'PowerPoint',
  PDF: 'PDF',
  Image: 'Image',
  Video: 'Video',
  Audio: 'Audio',
  CSV: 'CSV',
  JSON: 'JSON',
  YAML: 'YAML',
  XML: 'XML',
  TXT: 'TXT',
  HTML: 'HTML',
  React: 'React',
  Python: 'Python',
  Java: 'Java',
  Go: 'Go',
  Rust: 'Rust',
  SQL: 'SQL',
  Canvas: 'Canvas',
  Whiteboard: 'Whiteboard',
  DatabaseSchema: 'DatabaseSchema',
  Other: 'Other'
};

exports.FileStatus = exports.$Enums.FileStatus = {
  Draft: 'Draft',
  Active: 'Active',
  Archived: 'Archived',
  Locked: 'Locked',
  Deleted: 'Deleted'
};

exports.FileVersionSource = exports.$Enums.FileVersionSource = {
  Manual: 'Manual',
  AI: 'AI',
  Import: 'Import',
  Upload: 'Upload'
};

exports.ObjectType = exports.$Enums.ObjectType = {
  Workspace: 'Workspace',
  Project: 'Project',
  Folder: 'Folder',
  File: 'File',
  Task: 'Task',
  Meeting: 'Meeting',
  Prompt: 'Prompt',
  Template: 'Template',
  Knowledge: 'Knowledge',
  Person: 'Person',
  Company: 'Company',
  Repository: 'Repository',
  Workflow: 'Workflow',
  Automation: 'Automation',
  Image: 'Image',
  Video: 'Video',
  Spreadsheet: 'Spreadsheet',
  Presentation: 'Presentation',
  Database: 'Database',
  Website: 'Website',
  API: 'API'
};

exports.ObjectStatus = exports.$Enums.ObjectStatus = {
  Draft: 'Draft',
  Active: 'Active',
  Archived: 'Archived',
  Deleted: 'Deleted',
  Completed: 'Completed',
  InReview: 'InReview',
  Pending: 'Pending',
  Cancelled: 'Cancelled'
};

exports.ObjectRelationshipType = exports.$Enums.ObjectRelationshipType = {
  belongs_to: 'belongs_to',
  references: 'references',
  generated_from: 'generated_from',
  contains: 'contains',
  depends_on: 'depends_on',
  blocks: 'blocks',
  related_to: 'related_to',
  assigned_to: 'assigned_to',
  uses_template: 'uses_template',
  attached_to: 'attached_to',
  derived_from: 'derived_from'
};

exports.ObjectActivityType = exports.$Enums.ObjectActivityType = {
  Created: 'Created',
  Updated: 'Updated',
  Archived: 'Archived',
  Deleted: 'Deleted',
  Shared: 'Shared',
  Referenced: 'Referenced',
  Viewed: 'Viewed',
  Downloaded: 'Downloaded',
  AiGenerated: 'AiGenerated'
};

exports.WorkspaceMemberRole = exports.$Enums.WorkspaceMemberRole = {
  Owner: 'Owner',
  Admin: 'Admin',
  Manager: 'Manager',
  Editor: 'Editor',
  Viewer: 'Viewer',
  Guest: 'Guest'
};

exports.BrainIntent = exports.$Enums.BrainIntent = {
  Create: 'Create',
  Update: 'Update',
  Delete: 'Delete',
  Search: 'Search',
  Summarize: 'Summarize',
  Generate: 'Generate',
  Translate: 'Translate',
  Explain: 'Explain',
  Research: 'Research',
  Analyze: 'Analyze',
  Automate: 'Automate',
  Schedule: 'Schedule',
  Build: 'Build',
  Deploy: 'Deploy',
  Import: 'Import',
  Export: 'Export',
  Review: 'Review',
  Approve: 'Approve',
  Compare: 'Compare'
};

exports.BrainAgentKind = exports.$Enums.BrainAgentKind = {
  Proposal: 'Proposal',
  Developer: 'Developer',
  Finance: 'Finance',
  Research: 'Research',
  Meeting: 'Meeting',
  Design: 'Design',
  Legal: 'Legal',
  Marketing: 'Marketing',
  General: 'General'
};

exports.BrainModelProvider = exports.$Enums.BrainModelProvider = {
  LocalStub: 'LocalStub',
  OpenAI: 'OpenAI',
  Anthropic: 'Anthropic',
  GoogleGemini: 'GoogleGemini',
  Grok: 'Grok',
  Mistral: 'Mistral',
  DeepSeek: 'DeepSeek',
  Ollama: 'Ollama'
};

exports.BrainExecutionStatus = exports.$Enums.BrainExecutionStatus = {
  Planned: 'Planned',
  Running: 'Running',
  Completed: 'Completed',
  Failed: 'Failed',
  Cancelled: 'Cancelled',
  AwaitingConfirmation: 'AwaitingConfirmation'
};

exports.BrainMemoryScope = exports.$Enums.BrainMemoryScope = {
  user: 'user',
  workspace: 'workspace'
};

exports.PlanComplexity = exports.$Enums.PlanComplexity = {
  Simple: 'Simple',
  Medium: 'Medium',
  Complex: 'Complex',
  Enterprise: 'Enterprise',
  Massive: 'Massive'
};

exports.PlanStrategy = exports.$Enums.PlanStrategy = {
  SingleStep: 'SingleStep',
  MultiStep: 'MultiStep',
  Parallel: 'Parallel',
  Sequential: 'Sequential',
  Conditional: 'Conditional',
  Hybrid: 'Hybrid'
};

exports.ExecutionPlanStatus = exports.$Enums.ExecutionPlanStatus = {
  Draft: 'Draft',
  PendingApproval: 'PendingApproval',
  Approved: 'Approved',
  Rejected: 'Rejected',
  Running: 'Running',
  Completed: 'Completed',
  Failed: 'Failed',
  Cancelled: 'Cancelled',
  Paused: 'Paused'
};

exports.ExecutionStepStatus = exports.$Enums.ExecutionStepStatus = {
  Pending: 'Pending',
  Ready: 'Ready',
  Running: 'Running',
  Completed: 'Completed',
  Failed: 'Failed',
  Skipped: 'Skipped',
  Cancelled: 'Cancelled'
};

exports.Prisma.ModelName = {
  User: 'User',
  Team: 'Team',
  Project: 'Project',
  ProjectTeam: 'ProjectTeam',
  Task: 'Task',
  TaskAssignment: 'TaskAssignment',
  Attachment: 'Attachment',
  Comment: 'Comment',
  Workspace: 'Workspace',
  FloxProject: 'FloxProject',
  FloxFolder: 'FloxFolder',
  FloxFile: 'FloxFile',
  FloxFileVersion: 'FloxFileVersion',
  FloxObject: 'FloxObject',
  ObjectRelationship: 'ObjectRelationship',
  ObjectActivity: 'ObjectActivity',
  ObjectPermission: 'ObjectPermission',
  WorkspaceMember: 'WorkspaceMember',
  WorkspaceAuditLog: 'WorkspaceAuditLog',
  BrainExecution: 'BrainExecution',
  BrainMemory: 'BrainMemory',
  BrainEvent: 'BrainEvent',
  ExecutionPlan: 'ExecutionPlan',
  ExecutionPlanStep: 'ExecutionPlanStep'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
