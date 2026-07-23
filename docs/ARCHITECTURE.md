# Flox Architecture Map (ARCH-001 scaffold)

In-process **modular monolith** hosted by Next.js. Services are TypeScript modules with clear interfaces — not separate deployables yet.

## Layer map (`client/src/`)

| Layer | Path | Role |
|-------|------|------|
| Presentation | `app/`, `components/` | UI only |
| Application | `app/api/v1/**` | Auth, Zod, DTO → call services (no Prisma/AI internals) |
| Domain | `domain/` | Workspace, Object business rules; Project/Task Express adapters |
| AI | `ai/` | Brain Gateway, Planner, Execution Engine, Tool Hub, Knowledge Graph |
| Infrastructure | `infra/` | Prisma, cache/storage/search adapters |
| Platform | `platform/` | Event bus, workspace-scope, errors |

Legacy `brain/` and `planner/` modules remain as implementation details with shims; public entry points are under `ai/`.

## Principles (enforced in scaffold)

1. **Workspace scope** — queries go through `requireWorkspaceId` / membership checks.
2. **Event bus** — major workspace/object/brain/planner actions publish via `platform/events`.
3. **Infra stubs** — Redis → in-memory cache; S3 → local stub; search → Postgres keyword.
4. **Express adapters** — Project/Task still call `NEXT_PUBLIC_API_BASE_URL`.
5. **Planner never executes** — Brain execute always ties to an `ExecutionPlan` and runs only when status is `Approved` (or auto-approved non-dangerous plans).

## Observability

- `GET /api/v1/architecture/health` — structured adapter/service status
- `/architecture` — presentation of live vs stub services

## Out of scope (this pass)

Real Redis/S3/OpenSearch/K8s, microservice split, migrating Express projects/tasks into Universal Objects, vector DB.
