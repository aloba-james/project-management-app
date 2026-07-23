import { z } from "zod";

export const objectTypeSchema = z.enum([
  "Workspace",
  "Project",
  "Folder",
  "File",
  "Task",
  "Meeting",
  "Prompt",
  "Template",
  "Knowledge",
  "Person",
  "Company",
  "Repository",
  "Workflow",
  "Automation",
  "Image",
  "Video",
  "Spreadsheet",
  "Presentation",
  "Database",
  "Website",
  "API",
]);

export const objectStatusSchema = z.enum([
  "Draft",
  "Active",
  "Archived",
  "Deleted",
  "Completed",
  "InReview",
  "Pending",
  "Cancelled",
]);

export const relationshipTypeSchema = z.enum([
  "belongs_to",
  "references",
  "generated_from",
  "contains",
  "depends_on",
  "blocks",
  "related_to",
  "assigned_to",
  "uses_template",
  "attached_to",
  "derived_from",
]);

export const permissionActionSchema = z.enum([
  "View",
  "Comment",
  "Edit",
  "Delete",
  "Share",
  "Move",
  "Archive",
]);

export const createObjectSchema = z.object({
  workspaceId: z.string().uuid(),
  objectType: objectTypeSchema,
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).optional().nullable(),
  status: objectStatusSchema.optional().default("Draft"),
  tags: z.array(z.string().trim().min(1).max(50)).max(50).optional().default([]),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
});

export const updateObjectSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(5000).optional().nullable(),
  status: objectStatusSchema.optional(),
  tags: z.array(z.string().trim().min(1).max(50)).max(50).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  aiSummary: z.string().trim().max(5000).optional().nullable(),
});

export const listObjectsQuerySchema = z.object({
  workspaceId: z.string().uuid(),
  objectType: objectTypeSchema.optional(),
  status: objectStatusSchema.optional(),
  q: z.string().trim().optional(),
  includeDeleted: z
    .enum(["true", "false"])
    .optional()
    .default("false")
    .transform((v) => v === "true"),
});

export const createRelationshipSchema = z.object({
  targetObjectId: z.string().uuid(),
  relationshipType: relationshipTypeSchema,
});

export const upsertPermissionsSchema = z.object({
  userId: z.number().int().positive(),
  actions: z.array(permissionActionSchema).min(1),
});

export const searchObjectsQuerySchema = listObjectsQuerySchema.extend({
  q: z.string().trim().min(1),
});

export const aiContextQuerySchema = z.object({
  workspaceId: z.string().uuid(),
  rootObjectId: z.string().uuid().optional(),
});

export type CreateObjectInput = z.infer<typeof createObjectSchema>;
export type UpdateObjectInput = z.infer<typeof updateObjectSchema>;
