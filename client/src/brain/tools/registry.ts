import { prisma } from "@/lib/prisma";
import { buildObjectAiSummary, CREATOR_ACTIONS } from "@/lib/object-auth";
import { writeObjectActivity } from "@/lib/object-activity";
import { getMemoryMap } from "@/brain/memory/store";
import { deriveTitle } from "@/brain/models/local-stub";
import { assertSameWorkspace, isDangerousTool } from "@/brain/safety";
import type { ToolContext, ToolResult } from "@/brain/types";
import type { ObjectType, Prisma } from "@/generated/prisma3";

type ToolHandler = (ctx: ToolContext, args?: Record<string, unknown>) => Promise<ToolResult>;

function inferObjectType(intent: string, prompt: string): ObjectType {
  const p = prompt.toLowerCase();
  if (/meeting|agenda|standup/.test(p) || intent === "Schedule") return "Meeting";
  if (/task|ticket|bug/.test(p)) return "Task";
  if (/folder/.test(p)) return "Folder";
  if (/file|document|docx|pdf/.test(p)) return "File";
  if (/template/.test(p)) return "Template";
  if (/project/.test(p)) return "Project";
  if (/prompt/.test(p)) return "Prompt";
  if (/research|analy|explain|review|summar/.test(p)) return "Knowledge";
  if (/proposal|generate|create|draft|write/.test(p)) return "File";
  return "Knowledge";
}

const tools: Record<string, ToolHandler> = {
  async search_objects(ctx) {
    const q = ctx.prompt.slice(0, 60);
    const objects = await prisma.floxObject.findMany({
      where: {
        workspaceId: ctx.workspaceId,
        deletedAt: null,
        status: { not: "Deleted" },
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { aiSummary: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 20,
      orderBy: { updatedAt: "desc" },
    });
    return {
      ok: true,
      tool: "search_objects",
      message: `Found ${objects.length} objects`,
      objectIds: objects.map((o) => o.id),
      data: objects.map((o) => ({
        id: o.id,
        name: o.name,
        objectType: o.objectType,
      })),
    };
  },

  async load_memory(ctx) {
    const memory = await getMemoryMap(ctx.workspaceId, ctx.userId);
    return {
      ok: true,
      tool: "load_memory",
      message: `Loaded ${Object.keys(memory).length} memory keys`,
      data: memory,
    };
  },

  async model_complete(ctx) {
    return {
      ok: true,
      tool: "model_complete",
      message: "Model completion deferred to executor",
      data: { deferred: true },
    };
  },

  async create_object(ctx) {
    const name = deriveTitle(ctx.prompt);
    const objectType = inferObjectType(ctx.intent, ctx.prompt);
    const description =
      ctx.generatedText?.slice(0, 2000) ||
      `Created by Flox Brain from prompt: ${ctx.prompt.slice(0, 200)}`;
    const aiSummary = buildObjectAiSummary(name, description, objectType);

    const created = await prisma.$transaction(async (tx) => {
      const obj = await tx.floxObject.create({
        data: {
          workspaceId: ctx.workspaceId,
          objectType,
          name,
          description,
          status: "Active",
          createdBy: ctx.userId,
          updatedBy: ctx.userId,
          aiSummary,
          tags: ["brain-generated"],
          metadata: {
            source: "flox-brain",
            intent: ctx.intent,
          } as Prisma.InputJsonValue,
        },
      });
      await tx.objectPermission.create({
        data: {
          objectId: obj.id,
          userId: ctx.userId,
          actions: CREATOR_ACTIONS,
        },
      });
      return obj;
    });

    await writeObjectActivity({
      objectId: created.id,
      workspaceId: ctx.workspaceId,
      userId: ctx.userId,
      activityType: "AiGenerated",
      metadata: { tool: "create_object" },
    });

    return {
      ok: true,
      tool: "create_object",
      message: `Created ${objectType} “${name}”`,
      objectIds: [created.id],
      data: { id: created.id, name: created.name, objectType },
    };
  },

  async update_object(ctx, args) {
    const targetId =
      (args?.objectId as string | undefined) || ctx.rootObjectId || undefined;
    if (!targetId) {
      return {
        ok: false,
        tool: "update_object",
        message: "No target object to update",
      };
    }
    const existing = await prisma.floxObject.findUnique({
      where: { id: targetId },
    });
    if (!existing) {
      return { ok: false, tool: "update_object", message: "Object not found" };
    }
    assertSameWorkspace(existing.workspaceId, ctx.workspaceId);

    const updated = await prisma.floxObject.update({
      where: { id: targetId },
      data: {
        description:
          ctx.generatedText?.slice(0, 2000) || existing.description,
        aiSummary: buildObjectAiSummary(
          existing.name,
          ctx.generatedText || existing.description,
          existing.objectType,
        ),
        updatedBy: ctx.userId,
      },
    });

    await writeObjectActivity({
      objectId: updated.id,
      workspaceId: ctx.workspaceId,
      userId: ctx.userId,
      activityType: "Updated",
      metadata: { tool: "update_object" },
    });

    return {
      ok: true,
      tool: "update_object",
      message: `Updated “${updated.name}”`,
      objectIds: [updated.id],
    };
  },

  async delete_object(ctx, args) {
    if (!ctx.confirm) {
      return {
        ok: false,
        tool: "delete_object",
        message: "Confirmation required for delete",
        requiresConfirmation: true,
      };
    }
    const targetId =
      (args?.objectId as string | undefined) || ctx.rootObjectId || undefined;
    if (!targetId) {
      return {
        ok: false,
        tool: "delete_object",
        message: "No target object to delete",
      };
    }
    const existing = await prisma.floxObject.findUnique({
      where: { id: targetId },
    });
    if (!existing) {
      return { ok: false, tool: "delete_object", message: "Object not found" };
    }
    assertSameWorkspace(existing.workspaceId, ctx.workspaceId);

    await prisma.floxObject.update({
      where: { id: targetId },
      data: {
        status: "Deleted",
        deletedAt: new Date(),
        updatedBy: ctx.userId,
      },
    });

    await writeObjectActivity({
      objectId: targetId,
      workspaceId: ctx.workspaceId,
      userId: ctx.userId,
      activityType: "Deleted",
      metadata: { tool: "delete_object" },
    });

    return {
      ok: true,
      tool: "delete_object",
      message: `Soft-deleted “${existing.name}”`,
      objectIds: [targetId],
    };
  },

  async create_relationship(ctx, args) {
    const sourceId =
      (args?.sourceObjectId as string | undefined) ||
      (args?.createdObjectId as string | undefined);
    const targetId =
      (args?.targetObjectId as string | undefined) ||
      ctx.rootObjectId ||
      undefined;

    if (!sourceId || !targetId || sourceId === targetId) {
      return {
        ok: true,
        tool: "create_relationship",
        message: "Skipped relationship (missing endpoints)",
      };
    }

    const [source, target] = await Promise.all([
      prisma.floxObject.findUnique({ where: { id: sourceId } }),
      prisma.floxObject.findUnique({ where: { id: targetId } }),
    ]);
    if (!source || !target) {
      return {
        ok: false,
        tool: "create_relationship",
        message: "Source or target missing",
      };
    }
    assertSameWorkspace(source.workspaceId, ctx.workspaceId);
    assertSameWorkspace(target.workspaceId, ctx.workspaceId);

    await prisma.objectRelationship.create({
      data: {
        workspaceId: ctx.workspaceId,
        sourceObjectId: sourceId,
        targetObjectId: targetId,
        relationshipType: "belongs_to",
      },
    });

    return {
      ok: true,
      tool: "create_relationship",
      message: `Linked ${source.name} → ${target.name}`,
      objectIds: [sourceId, targetId],
    };
  },

  async generate_summary(ctx, args) {
    const objectId =
      (args?.objectId as string | undefined) ||
      (args?.createdObjectId as string | undefined);
    if (!objectId) {
      return {
        ok: true,
        tool: "generate_summary",
        message: ctx.generatedText
          ? `Summary: ${ctx.generatedText.slice(0, 200)}`
          : "No object to summarize",
      };
    }
    const obj = await prisma.floxObject.findUnique({ where: { id: objectId } });
    if (!obj) {
      return { ok: false, tool: "generate_summary", message: "Object not found" };
    }
    assertSameWorkspace(obj.workspaceId, ctx.workspaceId);
    const summary = buildObjectAiSummary(obj.name, obj.description, obj.objectType);
    await prisma.floxObject.update({
      where: { id: objectId },
      data: { aiSummary: summary, updatedBy: ctx.userId },
    });
    return {
      ok: true,
      tool: "generate_summary",
      message: summary,
      objectIds: [objectId],
    };
  },
};

export async function runTool(
  tool: string,
  ctx: ToolContext,
  args?: Record<string, unknown>,
): Promise<ToolResult> {
  if (isDangerousTool(tool) && !ctx.confirm) {
    return {
      ok: false,
      tool,
      message: "Confirmation required for dangerous operation",
      requiresConfirmation: true,
    };
  }
  const handler = tools[tool];
  if (!handler) {
    return { ok: false, tool, message: `Unknown tool: ${tool}` };
  }
  return handler(ctx, args);
}

export function listTools(): string[] {
  return Object.keys(tools);
}
