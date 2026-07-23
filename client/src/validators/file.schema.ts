import { z } from "zod";

export const fileStatusSchema = z.enum([
  "Draft",
  "Active",
  "Archived",
  "Locked",
  "Deleted",
]);

export const fileKindSchema = z.enum([
  "Markdown",
  "Word",
  "Excel",
  "PowerPoint",
  "PDF",
  "Image",
  "Video",
  "Audio",
  "CSV",
  "JSON",
  "YAML",
  "XML",
  "TXT",
  "HTML",
  "React",
  "Python",
  "Java",
  "Go",
  "Rust",
  "SQL",
  "Canvas",
  "Whiteboard",
  "DatabaseSchema",
  "Other",
]);

export const createFileSchema = z.object({
  workspaceId: z.string().uuid(),
  projectId: z.string().uuid(),
  folderId: z.string().uuid().optional().nullable(),
  name: z.string().trim().min(1).max(260),
  extension: z.string().trim().max(32).optional(),
  mimeType: z.string().trim().max(120).optional(),
  fileKind: fileKindSchema.optional(),
  description: z.string().trim().max(5000).optional().nullable(),
  status: fileStatusSchema.optional().default("Draft"),
  contentText: z.string().max(2_000_000).optional().nullable(),
  language: z.string().trim().max(80).optional().nullable(),
  purpose: z.string().trim().max(500).optional().nullable(),
  intent: z.string().trim().max(500).optional().nullable(),
  generationSource: z.string().trim().max(120).optional().nullable(),
  promptId: z.string().uuid().optional().nullable(),
  executionPlanId: z.string().uuid().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
});

export const updateFileSchema = z.object({
  name: z.string().trim().min(1).max(260).optional(),
  description: z.string().trim().max(5000).optional().nullable(),
  status: fileStatusSchema.optional(),
  folderId: z.string().uuid().optional().nullable(),
  contentText: z.string().max(2_000_000).optional().nullable(),
  language: z.string().trim().max(80).optional().nullable(),
  purpose: z.string().trim().max(500).optional().nullable(),
  intent: z.string().trim().max(500).optional().nullable(),
  aiSummary: z.string().trim().max(5000).optional().nullable(),
  aiKeywords: z.array(z.string().trim().min(1).max(80)).max(50).optional(),
  topics: z.array(z.string().trim().min(1).max(80)).max(50).optional(),
  isFavorite: z.boolean().optional(),
  isPinned: z.boolean().optional(),
  isLocked: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  changeSummary: z.string().trim().max(1000).optional().nullable(),
});

export const listFilesQuerySchema = z.object({
  workspaceId: z.string().uuid(),
  projectId: z.string().uuid().optional(),
  folderId: z.string().uuid().optional().nullable(),
  status: fileStatusSchema.or(z.literal("all")).optional(),
  fileKind: fileKindSchema.optional(),
  q: z.string().trim().max(200).optional(),
});

export const rewriteFileSchema = z.object({
  instruction: z.string().trim().min(1).max(2000).optional(),
});

export const fileRelationshipSchema = z.object({
  targetObjectId: z.string().uuid(),
  relationshipType: z.enum([
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
  ]),
});

export type CreateFileInput = z.input<typeof createFileSchema>;
export type UpdateFileInput = z.infer<typeof updateFileSchema>;
