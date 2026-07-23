import { z } from "zod";

export const workspaceTypeSchema = z.enum([
  "Personal",
  "Business",
  "Startup",
  "Software",
  "Healthcare",
  "Education",
  "Marketing",
  "Research",
  "Finance",
  "Legal",
  "Custom",
]);

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  description: z.string().trim().max(2000).optional().nullable(),
  workspaceType: workspaceTypeSchema.optional().default("Personal"),
  industry: z.string().trim().max(100).optional().nullable(),
  website: z
    .union([z.string().url(), z.literal(""), z.null()])
    .optional()
    .transform((v) => (v ? v : null)),
  country: z.string().trim().max(100).optional().nullable(),
  timezone: z.string().trim().max(100).optional().nullable(),
  language: z.string().trim().max(50).optional().nullable(),
  icon: z.string().trim().max(50).optional().nullable(),
  logoUrl: z
    .union([z.string().url(), z.literal(""), z.null()])
    .optional()
    .transform((v) => (v ? v : null)),
  aiPrompt: z.string().trim().max(2000).optional().nullable(),
});

export const updateWorkspaceSchema = createWorkspaceSchema
  .partial()
  .omit({ aiPrompt: true })
  .extend({
    name: z.string().trim().min(1).max(100).optional(),
  });

export const aiSuggestionsSchema = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().max(2000).optional().nullable(),
  prompt: z.string().trim().max(2000).optional().nullable(),
});

export const listWorkspacesQuerySchema = z.object({
  status: z
    .enum(["Active", "Archived", "Deleted", "all"])
    .optional()
    .default("Active"),
  q: z.string().trim().optional(),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
export type AiSuggestionsInput = z.infer<typeof aiSuggestionsSchema>;
