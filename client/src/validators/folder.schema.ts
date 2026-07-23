import { z } from "zod";

export const folderStatusSchema = z.enum([
  "Active",
  "Archived",
  "Locked",
  "Hidden",
  "Deleted",
]);

export const folderTypeSchema = z.enum([
  "General",
  "Development",
  "Design",
  "Marketing",
  "Finance",
  "Legal",
  "HR",
  "Research",
  "Sales",
  "Operations",
  "Knowledge",
  "Archive",
  "Assets",
  "Templates",
  "Custom",
]);

export const createFolderSchema = z.object({
  workspaceId: z.string().uuid(),
  projectId: z.string().uuid(),
  parentFolderId: z.string().uuid().optional().nullable(),
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).optional().nullable(),
  icon: z.string().trim().max(50).optional().nullable(),
  color: z.string().trim().max(50).optional().nullable(),
  status: folderStatusSchema.optional().default("Active"),
  folderType: folderTypeSchema.optional().default("General"),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
});

export const updateFolderSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(5000).optional().nullable(),
  icon: z.string().trim().max(50).optional().nullable(),
  color: z.string().trim().max(50).optional().nullable(),
  status: folderStatusSchema.optional(),
  folderType: folderTypeSchema.optional(),
  aiSummary: z.string().trim().max(5000).optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  isFavorite: z.boolean().optional(),
  isPinned: z.boolean().optional(),
  isLocked: z.boolean().optional(),
});

export const listFoldersQuerySchema = z.object({
  workspaceId: z.string().uuid(),
  projectId: z.string().uuid(),
  parentFolderId: z.string().uuid().optional().nullable(),
  status: folderStatusSchema.or(z.literal("all")).optional(),
  q: z.string().trim().max(200).optional(),
  rootOnly: z
    .union([z.literal("true"), z.literal("false"), z.boolean()])
    .optional()
    .transform((v) => v === true || v === "true"),
});

export const moveFolderSchema = z.object({
  parentFolderId: z.string().uuid().optional().nullable(),
});

export const suggestFoldersSchema = z.object({
  workspaceId: z.string().uuid(),
  projectId: z.string().uuid(),
  prompt: z.string().trim().min(1).max(2000),
});

export const applyFolderSuggestionsSchema = z.object({
  workspaceId: z.string().uuid(),
  projectId: z.string().uuid(),
  parentFolderId: z.string().uuid().optional().nullable(),
  folders: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(200),
        folderType: folderTypeSchema.optional(),
        children: z
          .array(
            z.object({
              name: z.string().trim().min(1).max(200),
              folderType: folderTypeSchema.optional(),
            }),
          )
          .optional(),
      }),
    )
    .min(1)
    .max(40),
});

export type CreateFolderInput = z.input<typeof createFolderSchema>;
export type UpdateFolderInput = z.infer<typeof updateFolderSchema>;
