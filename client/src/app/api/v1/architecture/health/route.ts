import { expressProjectService as projectService } from "@/domain/project/express-project.service";
import { taskService } from "@/domain/task/task.service";
import { toolHub } from "@/ai/tools/hub";
import { knowledgeGraph } from "@/ai/knowledge/graph";
import { executionEngine } from "@/ai/execution/engine";
import { brainGateway } from "@/ai/brain/gateway";
import {
  getInfrastructureHealth,
  type HealthItem,
} from "@/platform/architecture-health";
import { jsonOk } from "@/lib/api-response";

export async function GET() {
  const [
    infra,
    projectHealth,
    taskHealth,
    kgHealth,
  ] = await Promise.all([
    getInfrastructureHealth(),
    projectService.health(),
    taskService.health(),
    knowledgeGraph.health(),
  ]);

  const services: HealthItem[] = [
    ...infra,
    {
      name: projectService.name,
      layer: "domain",
      status: "stub",
      ok: projectHealth.ok,
      detail: `${projectService.mode}; ${projectHealth.detail}`,
    },
    {
      name: taskService.name,
      layer: "domain",
      status: "stub",
      ok: taskHealth.ok,
      detail: `${taskService.mode}; ${taskHealth.detail}`,
    },
    {
      name: "workspace-service",
      layer: "domain",
      status: "live",
      ok: true,
      detail: "in-process Prisma",
    },
    {
      name: "object-service",
      layer: "domain",
      status: "live",
      ok: true,
      detail: "in-process Prisma",
    },
    {
      name: brainGateway.name,
      layer: "ai",
      status: "live",
      ok: true,
      detail: "requires Approved ExecutionPlan",
    },
    {
      name: "planner",
      layer: "ai",
      status: "live",
      ok: true,
      detail: "plans only; never executes",
    },
    {
      name: executionEngine.name,
      layer: "ai",
      status: "live",
      ok: true,
      detail: executionEngine.health().detail,
    },
    {
      name: toolHub.name,
      layer: "ai",
      status: "live",
      ok: true,
      detail: toolHub.health().detail,
    },
    {
      name: knowledgeGraph.name,
      layer: "ai",
      status: kgHealth.ok ? "live" : "degraded",
      ok: kgHealth.ok,
      detail: kgHealth.detail,
    },
  ];

  const ok = services.every((s) => s.ok || s.status === "stub");

  return jsonOk({
    ok,
    architecture: "modular-monolith",
    checkedAt: new Date().toISOString(),
    services,
  });
}
