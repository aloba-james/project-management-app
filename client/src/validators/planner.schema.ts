import { z } from "zod";
import {
  brainAgentSchema,
  brainModelProviderSchema,
} from "@/validators/brain.schema";

export const createPlannerSchema = z.object({
  workspaceId: z.string().uuid(),
  prompt: z.string().trim().min(1).max(8000),
  rootObjectId: z.string().uuid().optional().nullable(),
  selectedObjectIds: z.array(z.string().uuid()).max(50).optional(),
  preferredAgent: brainAgentSchema.optional(),
  preferredModel: brainModelProviderSchema.optional(),
});

export type CreatePlannerInput = z.infer<typeof createPlannerSchema>;
