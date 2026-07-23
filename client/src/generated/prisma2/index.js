
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime
} = require('./runtime/library.js')


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

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

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




  const path = require('path')

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
 * Create the Client
 */
const config = {
  "generator": {
    "name": "clientNext",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "C:\\Users\\Akinsanmi Aloba\\SANMI\\JaimeZil\\Projects\\project-management-app-1\\client\\src\\generated\\prisma2",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      }
    ],
    "previewFeatures": [],
    "sourceFilePath": "C:\\Users\\Akinsanmi Aloba\\SANMI\\JaimeZil\\Projects\\project-management-app-1\\server\\prisma\\schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null,
    "schemaEnvPath": "../../../../server/.env"
  },
  "relativePath": "../../../../server/prisma",
  "clientVersion": "5.22.0",
  "engineVersion": "605197351a3c8bdd595af2d2a9bc3025bca48ea2",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\ngenerator client {\n  provider      = \"prisma-client-js\"\n  binaryTargets = [\"native\", \"rhel-openssl-3.0.x\"]\n}\n\ngenerator clientNext {\n  provider = \"prisma-client-js\"\n  output   = \"../../client/src/generated/prisma2\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nenum WorkspaceType {\n  Personal\n  Business\n  Startup\n  Software\n  Healthcare\n  Education\n  Marketing\n  Research\n  Finance\n  Legal\n  Custom\n}\n\nenum WorkspacePlan {\n  Free\n  Pro\n  Enterprise\n}\n\nenum WorkspaceStatus {\n  Active\n  Archived\n  Deleted\n}\n\nenum WorkspaceMemberRole {\n  Owner\n  Admin\n  Manager\n  Editor\n  Viewer\n  Guest\n}\n\nenum ObjectType {\n  Workspace\n  Project\n  Folder\n  File\n  Task\n  Meeting\n  Prompt\n  Template\n  Knowledge\n  Person\n  Company\n  Repository\n  Workflow\n  Automation\n  Image\n  Video\n  Spreadsheet\n  Presentation\n  Database\n  Website\n  API\n}\n\nenum ObjectStatus {\n  Draft\n  Active\n  Archived\n  Deleted\n  Completed\n  InReview\n  Pending\n  Cancelled\n}\n\nenum ObjectRelationshipType {\n  belongs_to\n  references\n  generated_from\n  contains\n  depends_on\n  blocks\n  related_to\n  assigned_to\n  uses_template\n  attached_to\n  derived_from\n}\n\nenum ObjectActivityType {\n  Created\n  Updated\n  Archived\n  Deleted\n  Shared\n  Referenced\n  Viewed\n  Downloaded\n  AiGenerated\n}\n\nenum ObjectPermissionAction {\n  View\n  Comment\n  Edit\n  Delete\n  Share\n  Move\n  Archive\n}\n\nenum BrainIntent {\n  Create\n  Update\n  Delete\n  Search\n  Summarize\n  Generate\n  Translate\n  Explain\n  Research\n  Analyze\n  Automate\n  Schedule\n  Build\n  Deploy\n  Import\n  Export\n  Review\n  Approve\n  Compare\n}\n\nenum BrainExecutionStatus {\n  Planned\n  Running\n  Completed\n  Failed\n  Cancelled\n  AwaitingConfirmation\n}\n\nenum BrainAgentKind {\n  Proposal\n  Developer\n  Finance\n  Research\n  Meeting\n  Design\n  Legal\n  Marketing\n  General\n}\n\nenum BrainModelProvider {\n  LocalStub\n  OpenAI\n  Anthropic\n  GoogleGemini\n  Grok\n  Mistral\n  DeepSeek\n  Ollama\n}\n\nenum BrainMemoryScope {\n  user\n  workspace\n}\n\nenum PlanComplexity {\n  Simple\n  Medium\n  Complex\n  Enterprise\n  Massive\n}\n\nenum PlanStrategy {\n  SingleStep\n  MultiStep\n  Parallel\n  Sequential\n  Conditional\n  Hybrid\n}\n\nenum ExecutionPlanStatus {\n  Draft\n  PendingApproval\n  Approved\n  Rejected\n  Running\n  Completed\n  Failed\n  Cancelled\n  Paused\n}\n\nenum ExecutionStepStatus {\n  Pending\n  Ready\n  Running\n  Completed\n  Failed\n  Skipped\n  Cancelled\n}\n\nenum ProjectStatus {\n  Draft\n  Planning\n  Active\n  OnHold\n  Blocked\n  Completed\n  Cancelled\n  Archived\n  Deleted\n}\n\nenum ProjectType {\n  Software\n  Marketing\n  Research\n  Healthcare\n  Sales\n  Finance\n  HR\n  Construction\n  Legal\n  Education\n  Operations\n  Startup\n  Personal\n  Custom\n}\n\nenum ProjectVisibility {\n  Private\n  Workspace\n  PublicLink\n  Restricted\n}\n\nenum ProjectPriority {\n  Low\n  Medium\n  High\n  Critical\n}\n\nenum FolderStatus {\n  Active\n  Archived\n  Locked\n  Hidden\n  Deleted\n}\n\nenum FolderType {\n  General\n  Development\n  Design\n  Marketing\n  Finance\n  Legal\n  HR\n  Research\n  Sales\n  Operations\n  Knowledge\n  Archive\n  Assets\n  Templates\n  Custom\n}\n\nenum FileStatus {\n  Draft\n  Active\n  Archived\n  Locked\n  Deleted\n}\n\nenum FileKind {\n  Markdown\n  Word\n  Excel\n  PowerPoint\n  PDF\n  Image\n  Video\n  Audio\n  CSV\n  JSON\n  YAML\n  XML\n  TXT\n  HTML\n  React\n  Python\n  Java\n  Go\n  Rust\n  SQL\n  Canvas\n  Whiteboard\n  DatabaseSchema\n  Other\n}\n\nenum FileVersionSource {\n  Manual\n  AI\n  Import\n  Upload\n}\n\nmodel User {\n  userId            Int     @id @default(autoincrement())\n  cognitoId         String  @unique\n  username          String  @unique\n  profilePictureUrl String?\n  email             String?\n  teamId            Int?\n\n  authoredTasks      Task[]              @relation(\"TaskAuthor\")\n  assignedTasks      Task[]              @relation(\"TaskAssignee\")\n  taskAssignments    TaskAssignment[]\n  attachments        Attachment[]\n  comments           Comment[]\n  team               Team?               @relation(fields: [teamId], references: [id])\n  ownedWorkspaces    Workspace[]         @relation(\"WorkspaceOwner\")\n  workspaceMembers   WorkspaceMember[]\n  workspaceAuditLogs WorkspaceAuditLog[]\n  createdObjects     FloxObject[]        @relation(\"ObjectCreatedBy\")\n  updatedObjects     FloxObject[]        @relation(\"ObjectUpdatedBy\")\n  objectActivities   ObjectActivity[]\n  objectPermissions  ObjectPermission[]\n  brainExecutions    BrainExecution[]\n  brainMemories      BrainMemory[]\n  executionPlans     ExecutionPlan[]\n  ownedFloxProjects  FloxProject[]       @relation(\"FloxProjectOwner\")\n  ownedFloxFolders   FloxFolder[]        @relation(\"FloxFolderOwner\")\n  ownedFloxFiles     FloxFile[]          @relation(\"FloxFileOwner\")\n  fileVersionsEdited FloxFileVersion[]   @relation(\"FileVersionEditor\")\n}\n\nmodel Team {\n  id                   Int           @id @default(autoincrement())\n  teamName             String\n  productOwnerUserId   Int?\n  projectManagerUserId Int?\n  projectTeams         ProjectTeam[]\n  user                 User[]\n}\n\nmodel Project {\n  id           Int           @id @default(autoincrement())\n  name         String\n  description  String?\n  startDate    DateTime?\n  endDate      DateTime?\n  workspaceId  String?\n  workspace    Workspace?    @relation(fields: [workspaceId], references: [id])\n  tasks        Task[]\n  projectTeams ProjectTeam[]\n}\n\nmodel ProjectTeam {\n  id        Int     @id @default(autoincrement())\n  teamId    Int\n  projectId Int\n  team      Team    @relation(fields: [teamId], references: [id])\n  project   Project @relation(fields: [projectId], references: [id])\n}\n\nmodel Task {\n  id             Int       @id @default(autoincrement())\n  title          String\n  description    String?\n  status         String?\n  priority       String?\n  tags           String?\n  startDate      DateTime?\n  dueDate        DateTime?\n  points         Int?\n  projectId      Int\n  authorUserId   Int\n  assignedUserId Int?\n\n  project         Project          @relation(fields: [projectId], references: [id])\n  author          User             @relation(\"TaskAuthor\", fields: [authorUserId], references: [userId])\n  assignee        User?            @relation(\"TaskAssignee\", fields: [assignedUserId], references: [userId])\n  taskAssignments TaskAssignment[]\n  attachments     Attachment[]\n  comments        Comment[]\n}\n\nmodel TaskAssignment {\n  id     Int @id @default(autoincrement())\n  userId Int\n  taskId Int\n\n  user User @relation(fields: [userId], references: [userId])\n  task Task @relation(fields: [taskId], references: [id])\n}\n\nmodel Attachment {\n  id           Int     @id @default(autoincrement())\n  fileURL      String\n  fileName     String?\n  taskId       Int\n  uploadedById Int\n\n  task       Task @relation(fields: [taskId], references: [id])\n  uploadedBy User @relation(fields: [uploadedById], references: [userId])\n}\n\nmodel Comment {\n  id     Int    @id @default(autoincrement())\n  text   String\n  taskId Int\n  userId Int\n\n  task Task @relation(fields: [taskId], references: [id])\n  user User @relation(fields: [userId], references: [userId])\n}\n\nmodel Workspace {\n  id            String          @id @default(uuid())\n  name          String\n  slug          String          @unique\n  description   String?\n  logoUrl       String?\n  icon          String?\n  workspaceType WorkspaceType   @default(Personal)\n  industry      String?\n  website       String?\n  country       String?\n  timezone      String?\n  language      String?\n  plan          WorkspacePlan   @default(Free)\n  status        WorkspaceStatus @default(Active)\n  storageLimit  Int             @default(1073741824)\n  storageUsed   Int             @default(0)\n  ownerId       Int\n  createdAt     DateTime        @default(now())\n  updatedAt     DateTime        @updatedAt\n  deletedAt     DateTime?\n\n  owner               User                 @relation(\"WorkspaceOwner\", fields: [ownerId], references: [userId])\n  members             WorkspaceMember[]\n  auditLogs           WorkspaceAuditLog[]\n  projects            Project[]\n  floxProjects        FloxProject[]\n  floxFolders         FloxFolder[]\n  floxFiles           FloxFile[]\n  objects             FloxObject[]\n  objectRelationships ObjectRelationship[]\n  objectActivities    ObjectActivity[]\n  brainExecutions     BrainExecution[]\n  brainMemories       BrainMemory[]\n  brainEvents         BrainEvent[]\n  executionPlans      ExecutionPlan[]\n\n  @@unique([ownerId, name])\n  @@index([ownerId])\n  @@index([status])\n}\n\nmodel FloxProject {\n  id            String            @id @default(uuid())\n  workspaceId   String\n  name          String\n  slug          String\n  description   String?\n  status        ProjectStatus     @default(Draft)\n  priority      ProjectPriority   @default(Medium)\n  visibility    ProjectVisibility @default(Workspace)\n  ownerId       Int\n  projectType   ProjectType       @default(Custom)\n  industry      String?\n  budget        Float?\n  currency      String?           @default(\"USD\")\n  startDate     DateTime?\n  dueDate       DateTime?\n  completedDate DateTime?\n  progress      Int               @default(0)\n  color         String?\n  icon          String?\n  coverImage    String?\n  aiSummary     String?\n  metadata      Json              @default(\"{}\")\n  modules       Json              @default(\"{\\\"overview\\\":true,\\\"files\\\":true,\\\"folders\\\":true,\\\"tasks\\\":true,\\\"knowledge\\\":true,\\\"meetings\\\":true,\\\"activity\\\":true,\\\"templates\\\":true,\\\"members\\\":true,\\\"timeline\\\":true,\\\"ai\\\":true,\\\"settings\\\":true}\")\n  objectId      String?           @unique\n  createdAt     DateTime          @default(now())\n  updatedAt     DateTime          @updatedAt\n  deletedAt     DateTime?\n\n  workspace Workspace    @relation(fields: [workspaceId], references: [id], onDelete: Cascade)\n  owner     User         @relation(\"FloxProjectOwner\", fields: [ownerId], references: [userId])\n  folders   FloxFolder[]\n  files     FloxFile[]\n\n  @@unique([workspaceId, slug])\n  @@index([workspaceId])\n  @@index([ownerId])\n  @@index([status])\n  @@index([projectType])\n  @@map(\"flox_projects\")\n}\n\nmodel FloxFolder {\n  id             String       @id @default(uuid())\n  workspaceId    String\n  projectId      String\n  parentFolderId String?\n  name           String\n  slug           String\n  description    String?\n  icon           String?\n  color          String?\n  status         FolderStatus @default(Active)\n  folderType     FolderType   @default(General)\n  ownerId        Int\n  aiSummary      String?\n  metadata       Json         @default(\"{}\")\n  isFavorite     Boolean      @default(false)\n  isPinned       Boolean      @default(false)\n  isLocked       Boolean      @default(false)\n  objectId       String?      @unique\n  createdAt      DateTime     @default(now())\n  updatedAt      DateTime     @updatedAt\n  deletedAt      DateTime?\n\n  workspace Workspace    @relation(fields: [workspaceId], references: [id], onDelete: Cascade)\n  project   FloxProject  @relation(fields: [projectId], references: [id], onDelete: Cascade)\n  owner     User         @relation(\"FloxFolderOwner\", fields: [ownerId], references: [userId])\n  parent    FloxFolder?  @relation(\"FolderTree\", fields: [parentFolderId], references: [id], onDelete: SetNull)\n  children  FloxFolder[] @relation(\"FolderTree\")\n  objects   FloxObject[]\n  files     FloxFile[]\n\n  @@unique([projectId, parentFolderId, slug])\n  @@index([workspaceId])\n  @@index([projectId])\n  @@index([parentFolderId])\n  @@index([status])\n  @@map(\"flox_folders\")\n}\n\nmodel FloxFile {\n  id               String     @id @default(uuid())\n  workspaceId      String\n  projectId        String\n  folderId         String?\n  objectId         String?    @unique\n  name             String\n  extension        String     @default(\"\")\n  mimeType         String     @default(\"text/plain\")\n  fileKind         FileKind   @default(TXT)\n  description      String?\n  status           FileStatus @default(Draft)\n  ownerId          Int\n  size             Int        @default(0)\n  checksum         String?\n  language         String?\n  encoding         String?    @default(\"utf-8\")\n  version          Int        @default(1)\n  storageLocation  String?\n  thumbnail        String?\n  coverImage       String?\n  contentText      String?\n  aiSummary        String?\n  aiKeywords       String[]   @default([])\n  topics           String[]   @default([])\n  intent           String?\n  purpose          String?\n  entities         Json       @default(\"[]\")\n  confidenceScore  Float?\n  generationSource String?\n  promptId         String?\n  executionPlanId  String?\n  isFavorite       Boolean    @default(false)\n  isPinned         Boolean    @default(false)\n  isLocked         Boolean    @default(false)\n  metadata         Json       @default(\"{}\")\n  createdAt        DateTime   @default(now())\n  updatedAt        DateTime   @updatedAt\n  deletedAt        DateTime?\n\n  workspace Workspace         @relation(fields: [workspaceId], references: [id], onDelete: Cascade)\n  project   FloxProject       @relation(fields: [projectId], references: [id], onDelete: Cascade)\n  folder    FloxFolder?       @relation(fields: [folderId], references: [id], onDelete: SetNull)\n  owner     User              @relation(\"FloxFileOwner\", fields: [ownerId], references: [userId])\n  versions  FloxFileVersion[]\n\n  @@index([workspaceId])\n  @@index([projectId])\n  @@index([folderId])\n  @@index([status])\n  @@index([fileKind])\n  @@index([ownerId])\n  @@map(\"flox_files\")\n}\n\nmodel FloxFileVersion {\n  id              String            @id @default(uuid())\n  fileId          String\n  version         Int\n  contentText     String?\n  storageLocation String?\n  size            Int               @default(0)\n  checksum        String?\n  changeSummary   String?\n  editorId        Int?\n  source          FileVersionSource @default(Manual)\n  createdAt       DateTime          @default(now())\n\n  file   FloxFile @relation(fields: [fileId], references: [id], onDelete: Cascade)\n  editor User?    @relation(\"FileVersionEditor\", fields: [editorId], references: [userId], onDelete: SetNull)\n\n  @@unique([fileId, version])\n  @@index([fileId])\n  @@index([createdAt])\n  @@map(\"flox_file_versions\")\n}\n\nmodel FloxObject {\n  id          String       @id @default(uuid())\n  workspaceId String\n  folderId    String?\n  objectType  ObjectType\n  name        String\n  description String?\n  status      ObjectStatus @default(Draft)\n  createdBy   Int\n  updatedBy   Int?\n  createdAt   DateTime     @default(now())\n  updatedAt   DateTime     @updatedAt\n  deletedAt   DateTime?\n  aiSummary   String?\n  tags        String[]     @default([])\n  metadata    Json         @default(\"{}\")\n\n  workspace    Workspace            @relation(fields: [workspaceId], references: [id], onDelete: Cascade)\n  folder       FloxFolder?          @relation(fields: [folderId], references: [id], onDelete: SetNull)\n  creator      User                 @relation(\"ObjectCreatedBy\", fields: [createdBy], references: [userId])\n  updater      User?                @relation(\"ObjectUpdatedBy\", fields: [updatedBy], references: [userId])\n  outboundRels ObjectRelationship[] @relation(\"ObjectRelSource\")\n  inboundRels  ObjectRelationship[] @relation(\"ObjectRelTarget\")\n  activities   ObjectActivity[]\n  permissions  ObjectPermission[]\n\n  @@index([workspaceId])\n  @@index([folderId])\n  @@index([objectType])\n  @@index([status])\n  @@index([createdBy])\n  @@map(\"objects\")\n}\n\nmodel ObjectRelationship {\n  id               Int                    @id @default(autoincrement())\n  workspaceId      String\n  sourceObjectId   String\n  targetObjectId   String\n  relationshipType ObjectRelationshipType\n  createdAt        DateTime               @default(now())\n\n  workspace Workspace  @relation(fields: [workspaceId], references: [id], onDelete: Cascade)\n  source    FloxObject @relation(\"ObjectRelSource\", fields: [sourceObjectId], references: [id], onDelete: Cascade)\n  target    FloxObject @relation(\"ObjectRelTarget\", fields: [targetObjectId], references: [id], onDelete: Cascade)\n\n  @@index([workspaceId])\n  @@index([sourceObjectId])\n  @@index([targetObjectId])\n  @@map(\"object_relationships\")\n}\n\nmodel ObjectActivity {\n  id           Int                @id @default(autoincrement())\n  objectId     String\n  workspaceId  String\n  userId       Int?\n  activityType ObjectActivityType\n  metadata     Json?\n  createdAt    DateTime           @default(now())\n\n  object    FloxObject @relation(fields: [objectId], references: [id], onDelete: Cascade)\n  workspace Workspace  @relation(fields: [workspaceId], references: [id], onDelete: Cascade)\n  user      User?      @relation(fields: [userId], references: [userId], onDelete: SetNull)\n\n  @@index([objectId])\n  @@index([workspaceId])\n  @@index([createdAt])\n  @@map(\"object_activities\")\n}\n\nmodel ObjectPermission {\n  id        Int      @id @default(autoincrement())\n  objectId  String\n  userId    Int\n  actions   String[] @default([])\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  object FloxObject @relation(fields: [objectId], references: [id], onDelete: Cascade)\n  user   User       @relation(fields: [userId], references: [userId], onDelete: Cascade)\n\n  @@unique([objectId, userId])\n  @@index([userId])\n  @@map(\"object_permissions\")\n}\n\nmodel WorkspaceMember {\n  id          Int                 @id @default(autoincrement())\n  workspaceId String\n  userId      Int\n  role        WorkspaceMemberRole @default(Viewer)\n  joinedAt    DateTime            @default(now())\n\n  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)\n  user      User      @relation(fields: [userId], references: [userId], onDelete: Cascade)\n\n  @@unique([workspaceId, userId])\n  @@index([userId])\n}\n\nmodel WorkspaceAuditLog {\n  id          Int      @id @default(autoincrement())\n  workspaceId String\n  userId      Int?\n  action      String\n  ip          String?\n  device      String?\n  browser     String?\n  metadata    String?\n  createdAt   DateTime @default(now())\n\n  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)\n  user      User?     @relation(fields: [userId], references: [userId], onDelete: SetNull)\n\n  @@index([workspaceId])\n  @@index([createdAt])\n}\n\nmodel BrainExecution {\n  id              String               @id @default(uuid())\n  workspaceId     String\n  userId          Int\n  prompt          String\n  intent          BrainIntent\n  plan            Json                 @default(\"[]\")\n  contextSnapshot Json                 @default(\"{}\")\n  agent           BrainAgentKind       @default(General)\n  modelProvider   BrainModelProvider   @default(LocalStub)\n  modelId         String               @default(\"local-stub-v1\")\n  toolsUsed       Json                 @default(\"[]\")\n  result          Json?\n  resultObjectIds String[]             @default([])\n  tokenUsage      Int?\n  costCents       Int?\n  error           String?\n  durationMs      Int                  @default(0)\n  status          BrainExecutionStatus @default(Planned)\n  createdAt       DateTime             @default(now())\n  updatedAt       DateTime             @updatedAt\n\n  workspace Workspace    @relation(fields: [workspaceId], references: [id], onDelete: Cascade)\n  user      User         @relation(fields: [userId], references: [userId], onDelete: Cascade)\n  events    BrainEvent[]\n\n  @@index([workspaceId])\n  @@index([userId])\n  @@index([status])\n  @@index([createdAt])\n  @@map(\"brain_executions\")\n}\n\nmodel BrainMemory {\n  id          String           @id @default(uuid())\n  workspaceId String\n  userId      Int?\n  key         String\n  value       Json\n  scope       BrainMemoryScope\n  /// Stable uniqueness key: \"workspace\" or \"user:<id>\"\n  ownerKey    String\n  createdAt   DateTime         @default(now())\n  updatedAt   DateTime         @updatedAt\n\n  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)\n  user      User?     @relation(fields: [userId], references: [userId], onDelete: Cascade)\n\n  @@unique([workspaceId, ownerKey, key])\n  @@index([workspaceId])\n  @@index([userId])\n  @@map(\"brain_memories\")\n}\n\nmodel BrainEvent {\n  id          Int      @id @default(autoincrement())\n  workspaceId String\n  executionId String?\n  type        String\n  payload     Json     @default(\"{}\")\n  createdAt   DateTime @default(now())\n\n  workspace Workspace       @relation(fields: [workspaceId], references: [id], onDelete: Cascade)\n  execution BrainExecution? @relation(fields: [executionId], references: [id], onDelete: SetNull)\n\n  @@index([workspaceId])\n  @@index([executionId])\n  @@index([createdAt])\n  @@map(\"brain_events\")\n}\n\nmodel ExecutionPlan {\n  id                String              @id @default(uuid())\n  workspaceId       String\n  userId            Int\n  prompt            String\n  goal              String\n  summary           String?\n  intent            BrainIntent\n  complexity        PlanComplexity      @default(Simple)\n  strategy          PlanStrategy        @default(Sequential)\n  estimatedDuration Int                 @default(0)\n  estimatedTokens   Int                 @default(0)\n  estimatedCost     Int                 @default(0)\n  status            ExecutionPlanStatus @default(Draft)\n  approvalRequired  Boolean             @default(false)\n  dependencies      Json                @default(\"[]\")\n  warnings          Json                @default(\"[]\")\n  requiredAgents    String[]            @default([])\n  requiredModels    String[]            @default([])\n  requiredTools     String[]            @default([])\n  requiredObjects   String[]            @default([])\n  selectedObjectIds String[]            @default([])\n  rootObjectId      String?\n  brainExecutionId  String?\n  metadata          Json                @default(\"{}\")\n  createdAt         DateTime            @default(now())\n  updatedAt         DateTime            @updatedAt\n\n  workspace Workspace           @relation(fields: [workspaceId], references: [id], onDelete: Cascade)\n  user      User                @relation(fields: [userId], references: [userId], onDelete: Cascade)\n  steps     ExecutionPlanStep[]\n\n  @@index([workspaceId])\n  @@index([userId])\n  @@index([status])\n  @@index([createdAt])\n  @@map(\"execution_plans\")\n}\n\nmodel ExecutionPlanStep {\n  id               String              @id @default(uuid())\n  planId           String\n  order            Int\n  title            String\n  description      String?\n  agent            BrainAgentKind      @default(General)\n  tool             String\n  model            String?\n  status           ExecutionStepStatus @default(Pending)\n  estimatedTime    Int                 @default(0)\n  estimatedCost    Int                 @default(0)\n  retryCount       Int                 @default(0)\n  maxRetries       Int                 @default(3)\n  dependsOn        String[]            @default([])\n  outputObjects    String[]            @default([])\n  approvalRequired Boolean             @default(false)\n  error            String?\n  createdAt        DateTime            @default(now())\n  updatedAt        DateTime            @updatedAt\n\n  plan ExecutionPlan @relation(fields: [planId], references: [id], onDelete: Cascade)\n\n  @@index([planId])\n  @@index([order])\n  @@map(\"execution_plan_steps\")\n}\n",
  "inlineSchemaHash": "b9bb7c05de4fee17adfc6d907195a983448b5349bc3ae2ed22cfa1851d032347",
  "copyEngine": true
}

const fs = require('fs')

config.dirname = __dirname
if (!fs.existsSync(path.join(__dirname, 'schema.prisma'))) {
  const alternativePaths = [
    "../client/src/generated/prisma2",
    "client/src/generated/prisma2",
  ]
  
  const alternativePath = alternativePaths.find((altPath) => {
    return fs.existsSync(path.join(process.cwd(), altPath, 'schema.prisma'))
  }) ?? alternativePaths[0]

  config.dirname = path.join(process.cwd(), alternativePath)
  config.isBundled = true
}

config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"dbName\":null,\"fields\":[{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cognitoId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"username\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"profilePictureUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"teamId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"authoredTasks\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Task\",\"relationName\":\"TaskAuthor\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assignedTasks\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Task\",\"relationName\":\"TaskAssignee\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"taskAssignments\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TaskAssignment\",\"relationName\":\"TaskAssignmentToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"attachments\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Attachment\",\"relationName\":\"AttachmentToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"comments\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Comment\",\"relationName\":\"CommentToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"team\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Team\",\"relationName\":\"TeamToUser\",\"relationFromFields\":[\"teamId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ownedWorkspaces\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Workspace\",\"relationName\":\"WorkspaceOwner\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workspaceMembers\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"WorkspaceMember\",\"relationName\":\"UserToWorkspaceMember\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workspaceAuditLogs\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"WorkspaceAuditLog\",\"relationName\":\"UserToWorkspaceAuditLog\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdObjects\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FloxObject\",\"relationName\":\"ObjectCreatedBy\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedObjects\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FloxObject\",\"relationName\":\"ObjectUpdatedBy\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"objectActivities\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ObjectActivity\",\"relationName\":\"ObjectActivityToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"objectPermissions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ObjectPermission\",\"relationName\":\"ObjectPermissionToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"brainExecutions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BrainExecution\",\"relationName\":\"BrainExecutionToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"brainMemories\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BrainMemory\",\"relationName\":\"BrainMemoryToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"executionPlans\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ExecutionPlan\",\"relationName\":\"ExecutionPlanToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ownedFloxProjects\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FloxProject\",\"relationName\":\"FloxProjectOwner\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ownedFloxFolders\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FloxFolder\",\"relationName\":\"FloxFolderOwner\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ownedFloxFiles\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FloxFile\",\"relationName\":\"FloxFileOwner\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fileVersionsEdited\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FloxFileVersion\",\"relationName\":\"FileVersionEditor\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Team\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"teamName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"productOwnerUserId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectManagerUserId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectTeams\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ProjectTeam\",\"relationName\":\"ProjectTeamToTeam\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"TeamToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Project\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"endDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workspaceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workspace\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Workspace\",\"relationName\":\"ProjectToWorkspace\",\"relationFromFields\":[\"workspaceId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tasks\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Task\",\"relationName\":\"ProjectToTask\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectTeams\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ProjectTeam\",\"relationName\":\"ProjectToProjectTeam\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ProjectTeam\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"teamId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"team\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Team\",\"relationName\":\"ProjectTeamToTeam\",\"relationFromFields\":[\"teamId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"project\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Project\",\"relationName\":\"ProjectToProjectTeam\",\"relationFromFields\":[\"projectId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Task\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"priority\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tags\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dueDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"points\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"authorUserId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assignedUserId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"project\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Project\",\"relationName\":\"ProjectToTask\",\"relationFromFields\":[\"projectId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"author\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"TaskAuthor\",\"relationFromFields\":[\"authorUserId\"],\"relationToFields\":[\"userId\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assignee\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"TaskAssignee\",\"relationFromFields\":[\"assignedUserId\"],\"relationToFields\":[\"userId\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"taskAssignments\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TaskAssignment\",\"relationName\":\"TaskToTaskAssignment\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"attachments\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Attachment\",\"relationName\":\"AttachmentToTask\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"comments\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Comment\",\"relationName\":\"CommentToTask\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"TaskAssignment\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"taskId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"TaskAssignmentToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"userId\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"task\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Task\",\"relationName\":\"TaskToTaskAssignment\",\"relationFromFields\":[\"taskId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Attachment\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fileURL\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fileName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"taskId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"uploadedById\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"task\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Task\",\"relationName\":\"AttachmentToTask\",\"relationFromFields\":[\"taskId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"uploadedBy\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"AttachmentToUser\",\"relationFromFields\":[\"uploadedById\"],\"relationToFields\":[\"userId\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Comment\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"text\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"taskId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"task\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Task\",\"relationName\":\"CommentToTask\",\"relationFromFields\":[\"taskId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"CommentToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"userId\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Workspace\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"slug\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"logoUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"icon\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workspaceType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"WorkspaceType\",\"default\":\"Personal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"industry\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"website\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"country\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"timezone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"language\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"plan\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"WorkspacePlan\",\"default\":\"Free\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"WorkspaceStatus\",\"default\":\"Active\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"storageLimit\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":1073741824,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"storageUsed\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ownerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"owner\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"WorkspaceOwner\",\"relationFromFields\":[\"ownerId\"],\"relationToFields\":[\"userId\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"members\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"WorkspaceMember\",\"relationName\":\"WorkspaceToWorkspaceMember\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"auditLogs\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"WorkspaceAuditLog\",\"relationName\":\"WorkspaceToWorkspaceAuditLog\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projects\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Project\",\"relationName\":\"ProjectToWorkspace\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"floxProjects\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FloxProject\",\"relationName\":\"FloxProjectToWorkspace\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"floxFolders\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FloxFolder\",\"relationName\":\"FloxFolderToWorkspace\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"floxFiles\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FloxFile\",\"relationName\":\"FloxFileToWorkspace\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"objects\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FloxObject\",\"relationName\":\"FloxObjectToWorkspace\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"objectRelationships\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ObjectRelationship\",\"relationName\":\"ObjectRelationshipToWorkspace\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"objectActivities\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ObjectActivity\",\"relationName\":\"ObjectActivityToWorkspace\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"brainExecutions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BrainExecution\",\"relationName\":\"BrainExecutionToWorkspace\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"brainMemories\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BrainMemory\",\"relationName\":\"BrainMemoryToWorkspace\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"brainEvents\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BrainEvent\",\"relationName\":\"BrainEventToWorkspace\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"executionPlans\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ExecutionPlan\",\"relationName\":\"ExecutionPlanToWorkspace\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"ownerId\",\"name\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"ownerId\",\"name\"]}],\"isGenerated\":false},\"FloxProject\":{\"dbName\":\"flox_projects\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workspaceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"slug\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ProjectStatus\",\"default\":\"Draft\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"priority\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ProjectPriority\",\"default\":\"Medium\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visibility\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ProjectVisibility\",\"default\":\"Workspace\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ownerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ProjectType\",\"default\":\"Custom\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"industry\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"budget\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currency\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"USD\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dueDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"completedDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"progress\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"color\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"icon\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"coverImage\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"aiSummary\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"{}\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"modules\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"{\\\"overview\\\":true,\\\"files\\\":true,\\\"folders\\\":true,\\\"tasks\\\":true,\\\"knowledge\\\":true,\\\"meetings\\\":true,\\\"activity\\\":true,\\\"templates\\\":true,\\\"members\\\":true,\\\"timeline\\\":true,\\\"ai\\\":true,\\\"settings\\\":true}\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"objectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workspace\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Workspace\",\"relationName\":\"FloxProjectToWorkspace\",\"relationFromFields\":[\"workspaceId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"owner\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"FloxProjectOwner\",\"relationFromFields\":[\"ownerId\"],\"relationToFields\":[\"userId\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"folders\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FloxFolder\",\"relationName\":\"FloxFolderToFloxProject\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"files\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FloxFile\",\"relationName\":\"FloxFileToFloxProject\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"workspaceId\",\"slug\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"workspaceId\",\"slug\"]}],\"isGenerated\":false},\"FloxFolder\":{\"dbName\":\"flox_folders\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workspaceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"parentFolderId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"slug\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"icon\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"color\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"FolderStatus\",\"default\":\"Active\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"folderType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"FolderType\",\"default\":\"General\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ownerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"aiSummary\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"{}\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isFavorite\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isPinned\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isLocked\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"objectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workspace\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Workspace\",\"relationName\":\"FloxFolderToWorkspace\",\"relationFromFields\":[\"workspaceId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"project\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FloxProject\",\"relationName\":\"FloxFolderToFloxProject\",\"relationFromFields\":[\"projectId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"owner\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"FloxFolderOwner\",\"relationFromFields\":[\"ownerId\"],\"relationToFields\":[\"userId\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"parent\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FloxFolder\",\"relationName\":\"FolderTree\",\"relationFromFields\":[\"parentFolderId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"children\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FloxFolder\",\"relationName\":\"FolderTree\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"objects\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FloxObject\",\"relationName\":\"FloxFolderToFloxObject\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"files\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FloxFile\",\"relationName\":\"FloxFileToFloxFolder\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"projectId\",\"parentFolderId\",\"slug\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"projectId\",\"parentFolderId\",\"slug\"]}],\"isGenerated\":false},\"FloxFile\":{\"dbName\":\"flox_files\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workspaceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"folderId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"objectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"extension\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"mimeType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"text/plain\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fileKind\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"FileKind\",\"default\":\"TXT\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"FileStatus\",\"default\":\"Draft\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ownerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"size\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"checksum\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"language\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"encoding\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"utf-8\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"version\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":1,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"storageLocation\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"thumbnail\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"coverImage\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"contentText\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"aiSummary\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"aiKeywords\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"topics\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"intent\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"purpose\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"entities\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"[]\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"confidenceScore\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"generationSource\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"promptId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"executionPlanId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isFavorite\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isPinned\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isLocked\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"{}\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workspace\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Workspace\",\"relationName\":\"FloxFileToWorkspace\",\"relationFromFields\":[\"workspaceId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"project\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FloxProject\",\"relationName\":\"FloxFileToFloxProject\",\"relationFromFields\":[\"projectId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"folder\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FloxFolder\",\"relationName\":\"FloxFileToFloxFolder\",\"relationFromFields\":[\"folderId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"owner\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"FloxFileOwner\",\"relationFromFields\":[\"ownerId\"],\"relationToFields\":[\"userId\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"versions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FloxFileVersion\",\"relationName\":\"FloxFileToFloxFileVersion\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"FloxFileVersion\":{\"dbName\":\"flox_file_versions\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fileId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"version\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"contentText\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"storageLocation\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"size\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"checksum\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"changeSummary\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"editorId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"source\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"FileVersionSource\",\"default\":\"Manual\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"file\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FloxFile\",\"relationName\":\"FloxFileToFloxFileVersion\",\"relationFromFields\":[\"fileId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"editor\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"FileVersionEditor\",\"relationFromFields\":[\"editorId\"],\"relationToFields\":[\"userId\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"fileId\",\"version\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"fileId\",\"version\"]}],\"isGenerated\":false},\"FloxObject\":{\"dbName\":\"objects\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workspaceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"folderId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"objectType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ObjectType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ObjectStatus\",\"default\":\"Draft\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"aiSummary\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tags\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"{}\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workspace\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Workspace\",\"relationName\":\"FloxObjectToWorkspace\",\"relationFromFields\":[\"workspaceId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"folder\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FloxFolder\",\"relationName\":\"FloxFolderToFloxObject\",\"relationFromFields\":[\"folderId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creator\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"ObjectCreatedBy\",\"relationFromFields\":[\"createdBy\"],\"relationToFields\":[\"userId\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updater\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"ObjectUpdatedBy\",\"relationFromFields\":[\"updatedBy\"],\"relationToFields\":[\"userId\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"outboundRels\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ObjectRelationship\",\"relationName\":\"ObjectRelSource\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"inboundRels\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ObjectRelationship\",\"relationName\":\"ObjectRelTarget\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"activities\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ObjectActivity\",\"relationName\":\"FloxObjectToObjectActivity\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"permissions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ObjectPermission\",\"relationName\":\"FloxObjectToObjectPermission\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ObjectRelationship\":{\"dbName\":\"object_relationships\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workspaceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sourceObjectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"targetObjectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"relationshipType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ObjectRelationshipType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workspace\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Workspace\",\"relationName\":\"ObjectRelationshipToWorkspace\",\"relationFromFields\":[\"workspaceId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"source\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FloxObject\",\"relationName\":\"ObjectRelSource\",\"relationFromFields\":[\"sourceObjectId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"target\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FloxObject\",\"relationName\":\"ObjectRelTarget\",\"relationFromFields\":[\"targetObjectId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ObjectActivity\":{\"dbName\":\"object_activities\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"objectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workspaceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"activityType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ObjectActivityType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"object\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FloxObject\",\"relationName\":\"FloxObjectToObjectActivity\",\"relationFromFields\":[\"objectId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workspace\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Workspace\",\"relationName\":\"ObjectActivityToWorkspace\",\"relationFromFields\":[\"workspaceId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"ObjectActivityToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"userId\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ObjectPermission\":{\"dbName\":\"object_permissions\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"objectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actions\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"object\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FloxObject\",\"relationName\":\"FloxObjectToObjectPermission\",\"relationFromFields\":[\"objectId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"ObjectPermissionToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"userId\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"objectId\",\"userId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"objectId\",\"userId\"]}],\"isGenerated\":false},\"WorkspaceMember\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workspaceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"role\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"WorkspaceMemberRole\",\"default\":\"Viewer\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"joinedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workspace\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Workspace\",\"relationName\":\"WorkspaceToWorkspaceMember\",\"relationFromFields\":[\"workspaceId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"UserToWorkspaceMember\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"userId\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"workspaceId\",\"userId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"workspaceId\",\"userId\"]}],\"isGenerated\":false},\"WorkspaceAuditLog\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workspaceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"action\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ip\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"device\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"browser\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workspace\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Workspace\",\"relationName\":\"WorkspaceToWorkspaceAuditLog\",\"relationFromFields\":[\"workspaceId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"UserToWorkspaceAuditLog\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"userId\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"BrainExecution\":{\"dbName\":\"brain_executions\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workspaceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"prompt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"intent\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BrainIntent\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"plan\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"[]\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"contextSnapshot\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"{}\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agent\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"BrainAgentKind\",\"default\":\"General\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"modelProvider\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"BrainModelProvider\",\"default\":\"LocalStub\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"modelId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"local-stub-v1\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"toolsUsed\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"[]\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"result\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"resultObjectIds\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tokenUsage\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"costCents\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"error\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"durationMs\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"BrainExecutionStatus\",\"default\":\"Planned\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"workspace\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Workspace\",\"relationName\":\"BrainExecutionToWorkspace\",\"relationFromFields\":[\"workspaceId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"BrainExecutionToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"userId\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"events\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BrainEvent\",\"relationName\":\"BrainEventToBrainExecution\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"BrainMemory\":{\"dbName\":\"brain_memories\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workspaceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"key\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"value\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"scope\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BrainMemoryScope\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ownerKey\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Stable uniqueness key: \\\"workspace\\\" or \\\"user:<id>\\\"\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"workspace\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Workspace\",\"relationName\":\"BrainMemoryToWorkspace\",\"relationFromFields\":[\"workspaceId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"BrainMemoryToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"userId\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"workspaceId\",\"ownerKey\",\"key\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"workspaceId\",\"ownerKey\",\"key\"]}],\"isGenerated\":false},\"BrainEvent\":{\"dbName\":\"brain_events\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workspaceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"executionId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payload\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"{}\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workspace\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Workspace\",\"relationName\":\"BrainEventToWorkspace\",\"relationFromFields\":[\"workspaceId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"execution\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BrainExecution\",\"relationName\":\"BrainEventToBrainExecution\",\"relationFromFields\":[\"executionId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ExecutionPlan\":{\"dbName\":\"execution_plans\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workspaceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"prompt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"goal\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"summary\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"intent\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BrainIntent\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"complexity\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"PlanComplexity\",\"default\":\"Simple\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"strategy\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"PlanStrategy\",\"default\":\"Sequential\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estimatedDuration\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estimatedTokens\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estimatedCost\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ExecutionPlanStatus\",\"default\":\"Draft\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"approvalRequired\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dependencies\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"[]\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"warnings\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"[]\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"requiredAgents\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"requiredModels\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"requiredTools\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"requiredObjects\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"selectedObjectIds\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rootObjectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"brainExecutionId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"{}\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"workspace\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Workspace\",\"relationName\":\"ExecutionPlanToWorkspace\",\"relationFromFields\":[\"workspaceId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"ExecutionPlanToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"userId\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"steps\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ExecutionPlanStep\",\"relationName\":\"ExecutionPlanToExecutionPlanStep\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ExecutionPlanStep\":{\"dbName\":\"execution_plan_steps\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"planId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"order\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agent\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"BrainAgentKind\",\"default\":\"General\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tool\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"model\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ExecutionStepStatus\",\"default\":\"Pending\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estimatedTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estimatedCost\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"retryCount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maxRetries\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":3,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dependsOn\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"outputObjects\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"approvalRequired\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"error\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"plan\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ExecutionPlan\",\"relationName\":\"ExecutionPlanToExecutionPlanStep\",\"relationFromFields\":[\"planId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"WorkspaceType\":{\"values\":[{\"name\":\"Personal\",\"dbName\":null},{\"name\":\"Business\",\"dbName\":null},{\"name\":\"Startup\",\"dbName\":null},{\"name\":\"Software\",\"dbName\":null},{\"name\":\"Healthcare\",\"dbName\":null},{\"name\":\"Education\",\"dbName\":null},{\"name\":\"Marketing\",\"dbName\":null},{\"name\":\"Research\",\"dbName\":null},{\"name\":\"Finance\",\"dbName\":null},{\"name\":\"Legal\",\"dbName\":null},{\"name\":\"Custom\",\"dbName\":null}],\"dbName\":null},\"WorkspacePlan\":{\"values\":[{\"name\":\"Free\",\"dbName\":null},{\"name\":\"Pro\",\"dbName\":null},{\"name\":\"Enterprise\",\"dbName\":null}],\"dbName\":null},\"WorkspaceStatus\":{\"values\":[{\"name\":\"Active\",\"dbName\":null},{\"name\":\"Archived\",\"dbName\":null},{\"name\":\"Deleted\",\"dbName\":null}],\"dbName\":null},\"WorkspaceMemberRole\":{\"values\":[{\"name\":\"Owner\",\"dbName\":null},{\"name\":\"Admin\",\"dbName\":null},{\"name\":\"Manager\",\"dbName\":null},{\"name\":\"Editor\",\"dbName\":null},{\"name\":\"Viewer\",\"dbName\":null},{\"name\":\"Guest\",\"dbName\":null}],\"dbName\":null},\"ObjectType\":{\"values\":[{\"name\":\"Workspace\",\"dbName\":null},{\"name\":\"Project\",\"dbName\":null},{\"name\":\"Folder\",\"dbName\":null},{\"name\":\"File\",\"dbName\":null},{\"name\":\"Task\",\"dbName\":null},{\"name\":\"Meeting\",\"dbName\":null},{\"name\":\"Prompt\",\"dbName\":null},{\"name\":\"Template\",\"dbName\":null},{\"name\":\"Knowledge\",\"dbName\":null},{\"name\":\"Person\",\"dbName\":null},{\"name\":\"Company\",\"dbName\":null},{\"name\":\"Repository\",\"dbName\":null},{\"name\":\"Workflow\",\"dbName\":null},{\"name\":\"Automation\",\"dbName\":null},{\"name\":\"Image\",\"dbName\":null},{\"name\":\"Video\",\"dbName\":null},{\"name\":\"Spreadsheet\",\"dbName\":null},{\"name\":\"Presentation\",\"dbName\":null},{\"name\":\"Database\",\"dbName\":null},{\"name\":\"Website\",\"dbName\":null},{\"name\":\"API\",\"dbName\":null}],\"dbName\":null},\"ObjectStatus\":{\"values\":[{\"name\":\"Draft\",\"dbName\":null},{\"name\":\"Active\",\"dbName\":null},{\"name\":\"Archived\",\"dbName\":null},{\"name\":\"Deleted\",\"dbName\":null},{\"name\":\"Completed\",\"dbName\":null},{\"name\":\"InReview\",\"dbName\":null},{\"name\":\"Pending\",\"dbName\":null},{\"name\":\"Cancelled\",\"dbName\":null}],\"dbName\":null},\"ObjectRelationshipType\":{\"values\":[{\"name\":\"belongs_to\",\"dbName\":null},{\"name\":\"references\",\"dbName\":null},{\"name\":\"generated_from\",\"dbName\":null},{\"name\":\"contains\",\"dbName\":null},{\"name\":\"depends_on\",\"dbName\":null},{\"name\":\"blocks\",\"dbName\":null},{\"name\":\"related_to\",\"dbName\":null},{\"name\":\"assigned_to\",\"dbName\":null},{\"name\":\"uses_template\",\"dbName\":null},{\"name\":\"attached_to\",\"dbName\":null},{\"name\":\"derived_from\",\"dbName\":null}],\"dbName\":null},\"ObjectActivityType\":{\"values\":[{\"name\":\"Created\",\"dbName\":null},{\"name\":\"Updated\",\"dbName\":null},{\"name\":\"Archived\",\"dbName\":null},{\"name\":\"Deleted\",\"dbName\":null},{\"name\":\"Shared\",\"dbName\":null},{\"name\":\"Referenced\",\"dbName\":null},{\"name\":\"Viewed\",\"dbName\":null},{\"name\":\"Downloaded\",\"dbName\":null},{\"name\":\"AiGenerated\",\"dbName\":null}],\"dbName\":null},\"ObjectPermissionAction\":{\"values\":[{\"name\":\"View\",\"dbName\":null},{\"name\":\"Comment\",\"dbName\":null},{\"name\":\"Edit\",\"dbName\":null},{\"name\":\"Delete\",\"dbName\":null},{\"name\":\"Share\",\"dbName\":null},{\"name\":\"Move\",\"dbName\":null},{\"name\":\"Archive\",\"dbName\":null}],\"dbName\":null},\"BrainIntent\":{\"values\":[{\"name\":\"Create\",\"dbName\":null},{\"name\":\"Update\",\"dbName\":null},{\"name\":\"Delete\",\"dbName\":null},{\"name\":\"Search\",\"dbName\":null},{\"name\":\"Summarize\",\"dbName\":null},{\"name\":\"Generate\",\"dbName\":null},{\"name\":\"Translate\",\"dbName\":null},{\"name\":\"Explain\",\"dbName\":null},{\"name\":\"Research\",\"dbName\":null},{\"name\":\"Analyze\",\"dbName\":null},{\"name\":\"Automate\",\"dbName\":null},{\"name\":\"Schedule\",\"dbName\":null},{\"name\":\"Build\",\"dbName\":null},{\"name\":\"Deploy\",\"dbName\":null},{\"name\":\"Import\",\"dbName\":null},{\"name\":\"Export\",\"dbName\":null},{\"name\":\"Review\",\"dbName\":null},{\"name\":\"Approve\",\"dbName\":null},{\"name\":\"Compare\",\"dbName\":null}],\"dbName\":null},\"BrainExecutionStatus\":{\"values\":[{\"name\":\"Planned\",\"dbName\":null},{\"name\":\"Running\",\"dbName\":null},{\"name\":\"Completed\",\"dbName\":null},{\"name\":\"Failed\",\"dbName\":null},{\"name\":\"Cancelled\",\"dbName\":null},{\"name\":\"AwaitingConfirmation\",\"dbName\":null}],\"dbName\":null},\"BrainAgentKind\":{\"values\":[{\"name\":\"Proposal\",\"dbName\":null},{\"name\":\"Developer\",\"dbName\":null},{\"name\":\"Finance\",\"dbName\":null},{\"name\":\"Research\",\"dbName\":null},{\"name\":\"Meeting\",\"dbName\":null},{\"name\":\"Design\",\"dbName\":null},{\"name\":\"Legal\",\"dbName\":null},{\"name\":\"Marketing\",\"dbName\":null},{\"name\":\"General\",\"dbName\":null}],\"dbName\":null},\"BrainModelProvider\":{\"values\":[{\"name\":\"LocalStub\",\"dbName\":null},{\"name\":\"OpenAI\",\"dbName\":null},{\"name\":\"Anthropic\",\"dbName\":null},{\"name\":\"GoogleGemini\",\"dbName\":null},{\"name\":\"Grok\",\"dbName\":null},{\"name\":\"Mistral\",\"dbName\":null},{\"name\":\"DeepSeek\",\"dbName\":null},{\"name\":\"Ollama\",\"dbName\":null}],\"dbName\":null},\"BrainMemoryScope\":{\"values\":[{\"name\":\"user\",\"dbName\":null},{\"name\":\"workspace\",\"dbName\":null}],\"dbName\":null},\"PlanComplexity\":{\"values\":[{\"name\":\"Simple\",\"dbName\":null},{\"name\":\"Medium\",\"dbName\":null},{\"name\":\"Complex\",\"dbName\":null},{\"name\":\"Enterprise\",\"dbName\":null},{\"name\":\"Massive\",\"dbName\":null}],\"dbName\":null},\"PlanStrategy\":{\"values\":[{\"name\":\"SingleStep\",\"dbName\":null},{\"name\":\"MultiStep\",\"dbName\":null},{\"name\":\"Parallel\",\"dbName\":null},{\"name\":\"Sequential\",\"dbName\":null},{\"name\":\"Conditional\",\"dbName\":null},{\"name\":\"Hybrid\",\"dbName\":null}],\"dbName\":null},\"ExecutionPlanStatus\":{\"values\":[{\"name\":\"Draft\",\"dbName\":null},{\"name\":\"PendingApproval\",\"dbName\":null},{\"name\":\"Approved\",\"dbName\":null},{\"name\":\"Rejected\",\"dbName\":null},{\"name\":\"Running\",\"dbName\":null},{\"name\":\"Completed\",\"dbName\":null},{\"name\":\"Failed\",\"dbName\":null},{\"name\":\"Cancelled\",\"dbName\":null},{\"name\":\"Paused\",\"dbName\":null}],\"dbName\":null},\"ExecutionStepStatus\":{\"values\":[{\"name\":\"Pending\",\"dbName\":null},{\"name\":\"Ready\",\"dbName\":null},{\"name\":\"Running\",\"dbName\":null},{\"name\":\"Completed\",\"dbName\":null},{\"name\":\"Failed\",\"dbName\":null},{\"name\":\"Skipped\",\"dbName\":null},{\"name\":\"Cancelled\",\"dbName\":null}],\"dbName\":null},\"ProjectStatus\":{\"values\":[{\"name\":\"Draft\",\"dbName\":null},{\"name\":\"Planning\",\"dbName\":null},{\"name\":\"Active\",\"dbName\":null},{\"name\":\"OnHold\",\"dbName\":null},{\"name\":\"Blocked\",\"dbName\":null},{\"name\":\"Completed\",\"dbName\":null},{\"name\":\"Cancelled\",\"dbName\":null},{\"name\":\"Archived\",\"dbName\":null},{\"name\":\"Deleted\",\"dbName\":null}],\"dbName\":null},\"ProjectType\":{\"values\":[{\"name\":\"Software\",\"dbName\":null},{\"name\":\"Marketing\",\"dbName\":null},{\"name\":\"Research\",\"dbName\":null},{\"name\":\"Healthcare\",\"dbName\":null},{\"name\":\"Sales\",\"dbName\":null},{\"name\":\"Finance\",\"dbName\":null},{\"name\":\"HR\",\"dbName\":null},{\"name\":\"Construction\",\"dbName\":null},{\"name\":\"Legal\",\"dbName\":null},{\"name\":\"Education\",\"dbName\":null},{\"name\":\"Operations\",\"dbName\":null},{\"name\":\"Startup\",\"dbName\":null},{\"name\":\"Personal\",\"dbName\":null},{\"name\":\"Custom\",\"dbName\":null}],\"dbName\":null},\"ProjectVisibility\":{\"values\":[{\"name\":\"Private\",\"dbName\":null},{\"name\":\"Workspace\",\"dbName\":null},{\"name\":\"PublicLink\",\"dbName\":null},{\"name\":\"Restricted\",\"dbName\":null}],\"dbName\":null},\"ProjectPriority\":{\"values\":[{\"name\":\"Low\",\"dbName\":null},{\"name\":\"Medium\",\"dbName\":null},{\"name\":\"High\",\"dbName\":null},{\"name\":\"Critical\",\"dbName\":null}],\"dbName\":null},\"FolderStatus\":{\"values\":[{\"name\":\"Active\",\"dbName\":null},{\"name\":\"Archived\",\"dbName\":null},{\"name\":\"Locked\",\"dbName\":null},{\"name\":\"Hidden\",\"dbName\":null},{\"name\":\"Deleted\",\"dbName\":null}],\"dbName\":null},\"FolderType\":{\"values\":[{\"name\":\"General\",\"dbName\":null},{\"name\":\"Development\",\"dbName\":null},{\"name\":\"Design\",\"dbName\":null},{\"name\":\"Marketing\",\"dbName\":null},{\"name\":\"Finance\",\"dbName\":null},{\"name\":\"Legal\",\"dbName\":null},{\"name\":\"HR\",\"dbName\":null},{\"name\":\"Research\",\"dbName\":null},{\"name\":\"Sales\",\"dbName\":null},{\"name\":\"Operations\",\"dbName\":null},{\"name\":\"Knowledge\",\"dbName\":null},{\"name\":\"Archive\",\"dbName\":null},{\"name\":\"Assets\",\"dbName\":null},{\"name\":\"Templates\",\"dbName\":null},{\"name\":\"Custom\",\"dbName\":null}],\"dbName\":null},\"FileStatus\":{\"values\":[{\"name\":\"Draft\",\"dbName\":null},{\"name\":\"Active\",\"dbName\":null},{\"name\":\"Archived\",\"dbName\":null},{\"name\":\"Locked\",\"dbName\":null},{\"name\":\"Deleted\",\"dbName\":null}],\"dbName\":null},\"FileKind\":{\"values\":[{\"name\":\"Markdown\",\"dbName\":null},{\"name\":\"Word\",\"dbName\":null},{\"name\":\"Excel\",\"dbName\":null},{\"name\":\"PowerPoint\",\"dbName\":null},{\"name\":\"PDF\",\"dbName\":null},{\"name\":\"Image\",\"dbName\":null},{\"name\":\"Video\",\"dbName\":null},{\"name\":\"Audio\",\"dbName\":null},{\"name\":\"CSV\",\"dbName\":null},{\"name\":\"JSON\",\"dbName\":null},{\"name\":\"YAML\",\"dbName\":null},{\"name\":\"XML\",\"dbName\":null},{\"name\":\"TXT\",\"dbName\":null},{\"name\":\"HTML\",\"dbName\":null},{\"name\":\"React\",\"dbName\":null},{\"name\":\"Python\",\"dbName\":null},{\"name\":\"Java\",\"dbName\":null},{\"name\":\"Go\",\"dbName\":null},{\"name\":\"Rust\",\"dbName\":null},{\"name\":\"SQL\",\"dbName\":null},{\"name\":\"Canvas\",\"dbName\":null},{\"name\":\"Whiteboard\",\"dbName\":null},{\"name\":\"DatabaseSchema\",\"dbName\":null},{\"name\":\"Other\",\"dbName\":null}],\"dbName\":null},\"FileVersionSource\":{\"values\":[{\"name\":\"Manual\",\"dbName\":null},{\"name\":\"AI\",\"dbName\":null},{\"name\":\"Import\",\"dbName\":null},{\"name\":\"Upload\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined


const { warnEnvConflicts } = require('./runtime/library.js')

warnEnvConflicts({
    rootEnvPath: config.relativeEnvPaths.rootEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.rootEnvPath),
    schemaEnvPath: config.relativeEnvPaths.schemaEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.schemaEnvPath)
})

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

// file annotations for bundling tools to include these files
path.join(__dirname, "query_engine-windows.dll.node");
path.join(process.cwd(), "../client/src/generated/prisma2/query_engine-windows.dll.node")
// file annotations for bundling tools to include these files
path.join(__dirname, "schema.prisma");
path.join(process.cwd(), "../client/src/generated/prisma2/schema.prisma")
