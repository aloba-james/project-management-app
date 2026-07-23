import { createHash, randomUUID } from "crypto";
import { prisma } from "@/infra/db/prisma";
import { storage } from "@/infra/storage/local-stub";
import { AuthError } from "@/lib/workspace-auth";
import { CREATOR_ACTIONS } from "@/lib/object-auth";
import { eventBus, PlatformEvents } from "@/platform";
import { requireWorkspaceId } from "@/platform/workspace-scope";
import type { CreateFileInput, UpdateFileInput } from "@/validators/file.schema";
import type {
  FileKind,
  FileStatus,
  ObjectRelationshipType,
  Prisma,
} from "@/generated/prisma3";

function checksumOf(text: string) {
  return createHash("sha256").update(text).digest("hex").slice(0, 32);
}

function splitName(name: string, extension?: string) {
  if (extension) {
    return {
      base: name.replace(new RegExp(`\\.${extension}$`, "i"), ""),
      extension: extension.replace(/^\./, "").toLowerCase(),
    };
  }
  const idx = name.lastIndexOf(".");
  if (idx > 0 && idx < name.length - 1) {
    return {
      base: name.slice(0, idx),
      extension: name.slice(idx + 1).toLowerCase(),
    };
  }
  return { base: name, extension: "" };
}

function inferKind(extension: string, mimeType?: string): FileKind {
  const ext = extension.toLowerCase();
  const mime = (mimeType ?? "").toLowerCase();
  if (ext === "md" || mime.includes("markdown")) return "Markdown";
  if (["doc", "docx"].includes(ext)) return "Word";
  if (["xls", "xlsx"].includes(ext)) return "Excel";
  if (["ppt", "pptx"].includes(ext)) return "PowerPoint";
  if (ext === "pdf") return "PDF";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext) || mime.startsWith("image/"))
    return "Image";
  if (["mp4", "webm", "mov"].includes(ext) || mime.startsWith("video/")) return "Video";
  if (["mp3", "wav", "ogg"].includes(ext) || mime.startsWith("audio/")) return "Audio";
  if (ext === "csv") return "CSV";
  if (ext === "json") return "JSON";
  if (["yml", "yaml"].includes(ext)) return "YAML";
  if (ext === "xml") return "XML";
  if (["html", "htm"].includes(ext)) return "HTML";
  if (["tsx", "jsx"].includes(ext)) return "React";
  if (ext === "py") return "Python";
  if (ext === "java") return "Java";
  if (ext === "go") return "Go";
  if (ext === "rs") return "Rust";
  if (ext === "sql") return "SQL";
  if (ext === "txt" || mime.startsWith("text/")) return "TXT";
  return "Other";
}

function inferMime(extension: string, fileKind: FileKind): string {
  const map: Record<string, string> = {
    md: "text/markdown",
    txt: "text/plain",
    json: "application/json",
    csv: "text/csv",
    html: "text/html",
    py: "text/x-python",
    tsx: "text/typescript",
    jsx: "text/javascript",
    pdf: "application/pdf",
  };
  if (extension && map[extension]) return map[extension];
  if (fileKind === "Markdown") return "text/markdown";
  if (fileKind === "JSON") return "application/json";
  return "text/plain";
}

export function buildFileAiSummary(params: {
  name: string;
  description?: string | null;
  contentText?: string | null;
  fileKind: FileKind;
  purpose?: string | null;
}) {
  const content = params.contentText?.trim() ?? "";
  const preview = content.slice(0, 220).replace(/\s+/g, " ");
  const parts = [
    `This ${params.fileKind.toLowerCase()} file “${params.name}”`,
  ];
  if (params.purpose) parts.push(`serves to ${params.purpose}`);
  if (params.description?.trim()) {
    parts.push(`— ${params.description.trim().slice(0, 140)}`);
  } else if (preview) {
    parts.push(`contains: ${preview}${content.length > 220 ? "…" : ""}`);
  } else {
    parts.push("has no content yet.");
  }
  return parts.join(" ");
}

function extractKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 4);
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([w]) => w);
}

function extractTopics(text: string, fileKind: FileKind): string[] {
  const topics = new Set<string>([fileKind]);
  const t = text.toLowerCase();
  if (/budget|cost|pricing|invoice/.test(t)) topics.add("Finance");
  if (/hospital|clinic|pharmacy|patient/.test(t)) topics.add("Healthcare");
  if (/deploy|kubernetes|infra|server/.test(t)) topics.add("Infrastructure");
  if (/proposal|contract|agreement/.test(t)) topics.add("Commercial");
  if (/api|schema|database|auth/.test(t)) topics.add("Engineering");
  return [...topics].slice(0, 8);
}

function extractEntities(text: string): Array<{ type: string; value: string }> {
  const entities: Array<{ type: string; value: string }> = [];
  const dates = text.match(
    /\b(?:\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|\d{4}-\d{2}-\d{2})\b/gi,
  );
  for (const d of dates?.slice(0, 5) ?? []) {
    entities.push({ type: "Date", value: d });
  }
  const companies = text.match(
    /\b([A-Z][a-zA-Z0-9&]+(?:\s+[A-Z][a-zA-Z0-9&]+){0,3})\s+(?:Hospital|Clinic|Inc|Ltd|LLC|Corp)\b/g,
  );
  for (const c of companies?.slice(0, 5) ?? []) {
    entities.push({ type: "Company", value: c.trim() });
  }
  return entities;
}

export function serializeFile<
  T extends {
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    _count?: { versions?: number };
  },
>(file: T) {
  return {
    ...file,
    createdAt: file.createdAt.toISOString(),
    updatedAt: file.updatedAt.toISOString(),
    deletedAt: file.deletedAt?.toISOString() ?? null,
    versionCount: file._count?.versions ?? undefined,
  };
}

async function assertProject(workspaceId: string, projectId: string) {
  const project = await prisma.floxProject.findFirst({
    where: {
      id: projectId,
      workspaceId,
      deletedAt: null,
      status: { not: "Deleted" },
    },
  });
  if (!project) throw new AuthError("Project not found", 404);
  return project;
}

async function assertFolder(
  workspaceId: string,
  projectId: string,
  folderId: string | null | undefined,
) {
  if (!folderId) return null;
  const folder = await prisma.floxFolder.findFirst({
    where: {
      id: folderId,
      workspaceId,
      projectId,
      status: { not: "Deleted" },
    },
  });
  if (!folder) throw new AuthError("Folder not found", 404);
  return folder;
}

export async function createFile(userId: number, body: CreateFileInput) {
  const workspaceId = requireWorkspaceId(body.workspaceId);
  await assertProject(workspaceId, body.projectId);
  await assertFolder(workspaceId, body.projectId, body.folderId);

  const { base, extension } = splitName(body.name, body.extension);
  const displayName = extension ? `${base}.${extension}` : base;
  const fileKind =
    body.fileKind ?? inferKind(extension, body.mimeType);
  const mimeType = body.mimeType ?? inferMime(extension, fileKind);
  const contentText = body.contentText ?? "";
  const size = Buffer.byteLength(contentText, "utf8");
  const checksum = contentText ? checksumOf(contentText) : null;
  const aiSummary = buildFileAiSummary({
    name: displayName,
    description: body.description,
    contentText,
    fileKind,
    purpose: body.purpose,
  });
  const aiKeywords = contentText ? extractKeywords(contentText) : [];
  const topics = extractTopics(contentText || displayName, fileKind);
  const entities = contentText ? extractEntities(contentText) : [];

  const storageKey = `files/${workspaceId}/${body.projectId}/${randomUUID()}`;
  if (contentText) {
    await storage.put(storageKey, contentText, mimeType);
  }

  const file = await prisma.$transaction(async (tx) => {
    const created = await tx.floxFile.create({
      data: {
        workspaceId,
        projectId: body.projectId,
        folderId: body.folderId ?? null,
        name: displayName,
        extension,
        mimeType,
        fileKind,
        description: body.description ?? null,
        status: body.status ?? "Active",
        ownerId: userId,
        size,
        checksum,
        language: body.language ?? null,
        contentText: contentText || null,
        storageLocation: contentText ? storageKey : null,
        aiSummary,
        aiKeywords,
        topics,
        intent: body.intent ?? null,
        purpose: body.purpose ?? null,
        entities: entities as unknown as Prisma.InputJsonValue,
        confidenceScore: contentText ? 0.55 : null,
        generationSource: body.generationSource ?? null,
        promptId: body.promptId ?? null,
        executionPlanId: body.executionPlanId ?? null,
        metadata: (body.metadata ?? {}) as Prisma.InputJsonValue,
        version: 1,
      },
    });

    await tx.floxFileVersion.create({
      data: {
        fileId: created.id,
        version: 1,
        contentText: contentText || null,
        storageLocation: contentText ? storageKey : null,
        size,
        checksum,
        changeSummary: "Initial version",
        editorId: userId,
        source: body.generationSource ? "AI" : contentText ? "Manual" : "Manual",
      },
    });

    const object = await tx.floxObject.create({
      data: {
        workspaceId,
        folderId: body.folderId ?? null,
        objectType: "File",
        name: displayName,
        description: body.description ?? null,
        status: "Active",
        createdBy: userId,
        updatedBy: userId,
        aiSummary,
        tags: aiKeywords.slice(0, 8),
        metadata: {
          floxFileId: created.id,
          floxProjectId: body.projectId,
          fileKind,
        } as Prisma.InputJsonValue,
      },
    });

    await tx.objectPermission.create({
      data: {
        objectId: object.id,
        userId,
        actions: CREATOR_ACTIONS,
      },
    });

    return tx.floxFile.update({
      where: { id: created.id },
      data: { objectId: object.id },
      include: { _count: { select: { versions: true } } },
    });
  });

  await eventBus.publish(PlatformEvents.FileCreated, {
    workspaceId,
    payload: { fileId: file.id, projectId: file.projectId, name: file.name },
  });
  await eventBus.publish(PlatformEvents.VersionCreated, {
    workspaceId,
    payload: { fileId: file.id, version: 1 },
  });
  if (entities.length || aiKeywords.length) {
    await eventBus.publish(PlatformEvents.KnowledgeExtracted, {
      workspaceId,
      payload: {
        fileId: file.id,
        keywords: aiKeywords,
        entityCount: entities.length,
      },
    });
  }

  return serializeFile(file);
}

export async function listFiles(query: {
  workspaceId: string;
  projectId?: string;
  folderId?: string | null;
  status?: FileStatus | "all";
  fileKind?: FileKind;
  q?: string;
}) {
  const workspaceId = requireWorkspaceId(query.workspaceId);
  const files = await prisma.floxFile.findMany({
    where: {
      workspaceId,
      ...(query.projectId ? { projectId: query.projectId } : {}),
      ...(query.folderId !== undefined
        ? { folderId: query.folderId }
        : {}),
      ...(query.fileKind ? { fileKind: query.fileKind } : {}),
      ...(query.status === "all"
        ? {}
        : query.status
          ? { status: query.status }
          : { status: { not: "Deleted" }, deletedAt: null }),
      ...(query.q
        ? {
            OR: [
              { name: { contains: query.q, mode: "insensitive" } },
              { description: { contains: query.q, mode: "insensitive" } },
              { aiSummary: { contains: query.q, mode: "insensitive" } },
              { contentText: { contains: query.q, mode: "insensitive" } },
              { aiKeywords: { has: query.q.toLowerCase() } },
            ],
          }
        : {}),
    },
    orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
    take: 100,
    include: { _count: { select: { versions: true } } },
  });
  return files.map(serializeFile);
}

export async function getFile(id: string, workspaceId?: string) {
  const file = await prisma.floxFile.findUnique({
    where: { id },
    include: {
      _count: { select: { versions: true } },
      owner: {
        select: {
          userId: true,
          username: true,
          email: true,
          profilePictureUrl: true,
        },
      },
      versions: {
        orderBy: { version: "desc" },
        take: 20,
        include: {
          editor: { select: { userId: true, username: true } },
        },
      },
    },
  });
  if (!file || (workspaceId && file.workspaceId !== workspaceId)) {
    throw new AuthError("File not found", 404);
  }

  let relationships: {
    outbound: unknown[];
    inbound: unknown[];
  } = { outbound: [], inbound: [] };

  if (file.objectId) {
    const [outbound, inbound] = await Promise.all([
      prisma.objectRelationship.findMany({
        where: { sourceObjectId: file.objectId },
        include: { target: true },
        take: 30,
      }),
      prisma.objectRelationship.findMany({
        where: { targetObjectId: file.objectId },
        include: { source: true },
        take: 30,
      }),
    ]);
    relationships = {
      outbound: outbound.map((r) => ({
        id: r.id,
        relationshipType: r.relationshipType,
        target: {
          id: r.target.id,
          name: r.target.name,
          objectType: r.target.objectType,
        },
      })),
      inbound: inbound.map((r) => ({
        id: r.id,
        relationshipType: r.relationshipType,
        source: {
          id: r.source.id,
          name: r.source.name,
          objectType: r.source.objectType,
        },
      })),
    };
  }

  return {
    ...serializeFile(file),
    owner: file.owner,
    versions: file.versions.map((v) => ({
      ...v,
      createdAt: v.createdAt.toISOString(),
    })),
    relationships,
  };
}

export async function updateFile(
  id: string,
  userId: number,
  body: UpdateFileInput,
) {
  const existing = await prisma.floxFile.findUnique({ where: { id } });
  if (!existing || existing.status === "Deleted") {
    throw new AuthError("File not found", 404);
  }
  if (existing.isLocked && body.isLocked !== false) {
    throw new AuthError("File is locked", 400);
  }

  if (body.folderId !== undefined && body.folderId !== null) {
    await assertFolder(
      existing.workspaceId,
      existing.projectId,
      body.folderId,
    );
  }

  const contentChanged =
    body.contentText !== undefined &&
    body.contentText !== (existing.contentText ?? "");
  const nextContent =
    body.contentText !== undefined ? body.contentText : existing.contentText;
  const nextName = body.name ?? existing.name;
  const nextVersion = contentChanged ? existing.version + 1 : existing.version;
  const size =
    nextContent != null ? Buffer.byteLength(nextContent, "utf8") : existing.size;
  const checksum = nextContent ? checksumOf(nextContent) : existing.checksum;

  let storageLocation = existing.storageLocation;
  if (contentChanged && nextContent != null) {
    storageLocation = `files/${existing.workspaceId}/${existing.projectId}/${id}/v${nextVersion}`;
    await storage.put(storageLocation, nextContent, existing.mimeType);
  }

  const aiSummary =
    body.aiSummary !== undefined
      ? body.aiSummary
      : contentChanged || body.name || body.description || body.purpose
        ? buildFileAiSummary({
            name: nextName,
            description:
              body.description !== undefined
                ? body.description
                : existing.description,
            contentText: nextContent,
            fileKind: existing.fileKind,
            purpose:
              body.purpose !== undefined ? body.purpose : existing.purpose,
          })
        : existing.aiSummary;

  const aiKeywords =
    body.aiKeywords ??
    (contentChanged && nextContent
      ? extractKeywords(nextContent)
      : existing.aiKeywords);
  const topics =
    body.topics ??
    (contentChanged
      ? extractTopics(nextContent || nextName, existing.fileKind)
      : existing.topics);
  const entities =
    contentChanged && nextContent
      ? extractEntities(nextContent)
      : existing.entities;

  const file = await prisma.$transaction(async (tx) => {
    if (contentChanged) {
      await tx.floxFileVersion.create({
        data: {
          fileId: id,
          version: nextVersion,
          contentText: nextContent,
          storageLocation,
          size,
          checksum,
          changeSummary: body.changeSummary ?? "Content updated",
          editorId: userId,
          source: "Manual",
        },
      });
    }

    return tx.floxFile.update({
      where: { id },
      data: {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.description !== undefined
          ? { description: body.description }
          : {}),
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(body.folderId !== undefined ? { folderId: body.folderId } : {}),
        ...(body.contentText !== undefined
          ? { contentText: body.contentText }
          : {}),
        ...(body.language !== undefined ? { language: body.language } : {}),
        ...(body.purpose !== undefined ? { purpose: body.purpose } : {}),
        ...(body.intent !== undefined ? { intent: body.intent } : {}),
        ...(body.isFavorite !== undefined
          ? { isFavorite: body.isFavorite }
          : {}),
        ...(body.isPinned !== undefined ? { isPinned: body.isPinned } : {}),
        ...(body.isLocked !== undefined ? { isLocked: body.isLocked } : {}),
        ...(body.metadata !== undefined
          ? { metadata: body.metadata as Prisma.InputJsonValue }
          : {}),
        aiSummary,
        aiKeywords,
        topics,
        entities: entities as Prisma.InputJsonValue,
        size,
        checksum,
        storageLocation,
        version: nextVersion,
      },
      include: { _count: { select: { versions: true } } },
    });
  });

  if (file.objectId) {
    await prisma.floxObject.update({
      where: { id: file.objectId },
      data: {
        name: file.name,
        description: file.description,
        aiSummary: file.aiSummary,
        folderId: file.folderId,
        updatedBy: userId,
        tags: file.aiKeywords.slice(0, 8),
      },
    });
  }

  await eventBus.publish(PlatformEvents.FileUpdated, {
    workspaceId: file.workspaceId,
    payload: { fileId: id, version: file.version },
  });
  if (contentChanged) {
    await eventBus.publish(PlatformEvents.VersionCreated, {
      workspaceId: file.workspaceId,
      payload: { fileId: id, version: nextVersion },
    });
    await eventBus.publish(PlatformEvents.KnowledgeExtracted, {
      workspaceId: file.workspaceId,
      payload: { fileId: id, version: nextVersion },
    });
  }
  if (body.aiSummary !== undefined || contentChanged) {
    await eventBus.publish(PlatformEvents.SummaryUpdated, {
      workspaceId: file.workspaceId,
      payload: { fileId: id },
    });
  }

  return serializeFile(file);
}

export async function softDeleteFile(id: string, userId: number) {
  const existing = await prisma.floxFile.findUnique({ where: { id } });
  if (!existing) throw new AuthError("File not found", 404);
  if (existing.isLocked) throw new AuthError("File is locked", 400);

  const file = await prisma.floxFile.update({
    where: { id },
    data: { status: "Deleted", deletedAt: new Date() },
    include: { _count: { select: { versions: true } } },
  });
  if (existing.objectId) {
    await prisma.floxObject.update({
      where: { id: existing.objectId },
      data: {
        status: "Deleted",
        deletedAt: new Date(),
        updatedBy: userId,
      },
    });
  }
  await eventBus.publish(PlatformEvents.FileDeleted, {
    workspaceId: file.workspaceId,
    payload: { fileId: id },
  });
  return serializeFile(file);
}

export async function archiveFile(id: string) {
  const existing = await prisma.floxFile.findUnique({ where: { id } });
  if (!existing || existing.status === "Deleted") {
    throw new AuthError("File not found", 404);
  }
  const file = await prisma.floxFile.update({
    where: { id },
    data: { status: "Archived" },
    include: { _count: { select: { versions: true } } },
  });
  await eventBus.publish(PlatformEvents.FileArchived, {
    workspaceId: file.workspaceId,
    payload: { fileId: id },
  });
  return serializeFile(file);
}

export async function restoreFile(id: string) {
  const existing = await prisma.floxFile.findUnique({ where: { id } });
  if (!existing) throw new AuthError("File not found", 404);
  if (existing.status !== "Archived" && existing.status !== "Deleted") {
    throw new AuthError("File is already active", 400);
  }
  const file = await prisma.floxFile.update({
    where: { id },
    data: { status: "Active", deletedAt: null },
    include: { _count: { select: { versions: true } } },
  });
  await eventBus.publish(PlatformEvents.FileRestored, {
    workspaceId: file.workspaceId,
    payload: { fileId: id },
  });
  return serializeFile(file);
}

export async function duplicateFile(id: string, userId: number) {
  const source = await prisma.floxFile.findUnique({ where: { id } });
  if (!source || source.status === "Deleted") {
    throw new AuthError("File not found", 404);
  }
  const copy = await createFile(userId, {
    workspaceId: source.workspaceId,
    projectId: source.projectId,
    folderId: source.folderId,
    name: `${source.name.replace(/(\.[^.]+)?$/, " (copy)$1")}`,
    extension: source.extension || undefined,
    mimeType: source.mimeType,
    fileKind: source.fileKind,
    description: source.description,
    status: "Draft",
    contentText: source.contentText,
    language: source.language,
    purpose: source.purpose,
    intent: source.intent,
    metadata: (source.metadata as Record<string, unknown>) ?? {},
  });
  await eventBus.publish(PlatformEvents.FileDuplicated, {
    workspaceId: source.workspaceId,
    payload: { sourceId: id, fileId: copy.id },
  });
  return copy;
}

export async function summarizeFile(id: string, userId: number) {
  const existing = await prisma.floxFile.findUnique({ where: { id } });
  if (!existing || existing.status === "Deleted") {
    throw new AuthError("File not found", 404);
  }
  const aiSummary = buildFileAiSummary({
    name: existing.name,
    description: existing.description,
    contentText: existing.contentText,
    fileKind: existing.fileKind,
    purpose: existing.purpose,
  });
  const aiKeywords = existing.contentText
    ? extractKeywords(existing.contentText)
    : existing.aiKeywords;
  const topics = extractTopics(
    existing.contentText || existing.name,
    existing.fileKind,
  );
  const entities = existing.contentText
    ? extractEntities(existing.contentText)
    : [];

  const file = await prisma.floxFile.update({
    where: { id },
    data: {
      aiSummary,
      aiKeywords,
      topics,
      entities: entities as unknown as Prisma.InputJsonValue,
      confidenceScore: existing.contentText ? 0.7 : 0.3,
    },
    include: { _count: { select: { versions: true } } },
  });

  if (file.objectId) {
    await prisma.floxObject.update({
      where: { id: file.objectId },
      data: {
        aiSummary,
        tags: aiKeywords.slice(0, 8),
        updatedBy: userId,
      },
    });
  }

  await eventBus.publish(PlatformEvents.SummaryUpdated, {
    workspaceId: file.workspaceId,
    payload: { fileId: id, source: "summarize" },
  });
  await eventBus.publish(PlatformEvents.KnowledgeExtracted, {
    workspaceId: file.workspaceId,
    payload: { fileId: id, keywords: aiKeywords },
  });

  return serializeFile(file);
}

export async function rewriteFileContent(
  id: string,
  userId: number,
  instruction?: string,
) {
  const existing = await prisma.floxFile.findUnique({ where: { id } });
  if (!existing || existing.status === "Deleted") {
    throw new AuthError("File not found", 404);
  }
  if (existing.isLocked) throw new AuthError("File is locked", 400);

  const original = existing.contentText ?? "";
  const note = instruction?.trim() || "Improve clarity and structure";
  const rewritten = [
    original.trim()
      ? original
          .split(/\n+/)
          .map((line) => line.trim())
          .filter(Boolean)
          .join("\n\n")
      : `Draft content for ${existing.name}.`,
    "",
    `<!-- AI rewrite: ${note} -->`,
  ].join("\n");

  const updated = await updateFile(id, userId, {
    contentText: rewritten,
    changeSummary: `AI rewrite: ${note}`,
  });

  await prisma.floxFileVersion.updateMany({
    where: { fileId: id, version: updated.version },
    data: { source: "AI" },
  });

  return updated;
}

export async function addFileRelationship(
  id: string,
  userId: number,
  params: {
    targetObjectId: string;
    relationshipType: ObjectRelationshipType;
  },
) {
  const file = await prisma.floxFile.findUnique({ where: { id } });
  if (!file || !file.objectId || file.status === "Deleted") {
    throw new AuthError("File not found", 404);
  }
  const target = await prisma.floxObject.findFirst({
    where: {
      id: params.targetObjectId,
      workspaceId: file.workspaceId,
      deletedAt: null,
    },
  });
  if (!target) throw new AuthError("Target object not found", 404);

  const relationship = await prisma.objectRelationship.create({
    data: {
      workspaceId: file.workspaceId,
      sourceObjectId: file.objectId,
      targetObjectId: target.id,
      relationshipType: params.relationshipType,
    },
    include: { target: true },
  });

  await eventBus.publish(PlatformEvents.RelationshipUpdated, {
    workspaceId: file.workspaceId,
    payload: {
      fileId: id,
      relationshipId: relationship.id,
      relationshipType: params.relationshipType,
      userId,
    },
  });

  return {
    id: relationship.id,
    relationshipType: relationship.relationshipType,
    target: {
      id: relationship.target.id,
      name: relationship.target.name,
      objectType: relationship.target.objectType,
    },
  };
}

export async function listFileVersions(id: string) {
  const file = await prisma.floxFile.findUnique({ where: { id } });
  if (!file) throw new AuthError("File not found", 404);
  const versions = await prisma.floxFileVersion.findMany({
    where: { fileId: id },
    orderBy: { version: "desc" },
    include: {
      editor: { select: { userId: true, username: true } },
    },
  });
  return versions.map((v) => ({
    ...v,
    createdAt: v.createdAt.toISOString(),
  }));
}

export async function restoreFileVersion(
  id: string,
  version: number,
  userId: number,
) {
  const ver = await prisma.floxFileVersion.findUnique({
    where: { fileId_version: { fileId: id, version } },
  });
  if (!ver) throw new AuthError("Version not found", 404);
  return updateFile(id, userId, {
    contentText: ver.contentText,
    changeSummary: `Restored version ${version}`,
  });
}
