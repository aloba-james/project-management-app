import { z } from "zod";

export const projectStatusSchema = z.enum([
  "Draft",
  "Planning",
  "Active",
  "OnHold",
  "Blocked",
  "Completed",
  "Cancelled",
  "Archived",
  "Deleted",
]);

export const projectTypeSchema = z.enum([
  "Software",
  "Marketing",
  "Research",
  "Healthcare",
  "Sales",
  "Finance",
  "HR",
  "Construction",
  "Legal",
  "Education",
  "Operations",
  "Startup",
  "Personal",
  "Custom",
]);

export const projectVisibilitySchema = z.enum([
  "Private",
  "Workspace",
  "PublicLink",
  "Restricted",
]);

export const projectPrioritySchema = z.enum([
  "Low",
  "Medium",
  "High",
  "Critical",
]);

export const createProjectSchema = z.object({
  workspaceId: z.string().uuid(),
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).optional().nullable(),
  status: projectStatusSchema.optional().default("Draft"),
  priority: projectPrioritySchema.optional().default("Medium"),
  visibility: projectVisibilitySchema.optional().default("Workspace"),
  projectType: projectTypeSchema.optional().default("Custom"),
  industry: z.string().trim().max(100).optional().nullable(),
  budget: z.number().nonnegative().optional().nullable(),
  currency: z.string().trim().max(10).optional().nullable(),
  startDate: z.string().datetime().optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
  progress: z.number().int().min(0).max(100).optional(),
  color: z.string().trim().max(50).optional().nullable(),
  icon: z.string().trim().max(50).optional().nullable(),
  coverImage: z.string().url().optional().nullable().or(z.literal("")),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
  blueprint: z.enum(["Software", "Healthcare", "none"]).optional().default("none"),
});

export const updateProjectSchema = createProjectSchema
  .omit({ workspaceId: true, blueprint: true })
  .partial()
  .extend({
    name: z.string().trim().min(1).max(200).optional(),
    aiSummary: z.string().trim().max(5000).optional().nullable(),
    modules: z.record(z.string(), z.boolean()).optional(),
    completedDate: z.string().datetime().optional().nullable(),
  });

export const listProjectsQuerySchema = z.object({
  workspaceId: z.string().uuid(),
  status: projectStatusSchema.or(z.literal("all")).optional(),
  projectType: projectTypeSchema.optional(),
  q: z.string().trim().max(200).optional(),
  includeDeleted: z
    .union([z.literal("true"), z.literal("false"), z.boolean()])
    .optional()
    .transform((v) => v === true || v === "true"),
});

export const searchProjectsQuerySchema = z.object({
  workspaceId: z.string().uuid(),
  q: z.string().trim().min(1).max(200),
  status: projectStatusSchema.optional(),
  projectType: projectTypeSchema.optional(),
});

export const cloneProjectSchema = z.object({
  targetWorkspaceId: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(200).optional(),
});

export const fromPromptSchema = z.object({
  workspaceId: z.string().uuid(),
  prompt: z.string().trim().min(1).max(2000),
  name: z.string().trim().min(1).max(200).optional(),
});

export type CreateProjectInput = z.input<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
