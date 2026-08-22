# Inkstack — DevOps Passes Notes

Running log of infra work, comparisons, and known issues found while
building out CI/CD, IaC, container orchestration, monitoring, and
security passes on top of this app. App code stays fixed across passes;
only the surrounding tooling changes per pass.

---

## Known issues (tracked, not yet fixed)

### 1. Eager DB connection on import crashes app if Postgres isn't ready yet
- **File**: `backend/app/main.py`, line ~10 — `Base.metadata.create_all(bind=engine)`
  runs at module import time, before uvicorn starts serving.
- **Repro**: stop Postgres, start the backend — process throws an unhandled
  `sqlalchemy.exc.OperationalError` / `psycopg2.OperationalError` and exits
  instead of starting and retrying.
- **Why it matters**: Docker Compose hides this today via
  `depends_on: condition: service_healthy`, but Kubernetes gives no such
  ordering guarantee — a pod can be scheduled before its DB dependency is
  reachable (cold start, node reschedule, DB pod restart, etc.), and this
  code will crash-loop instead of waiting/retrying. No liveness/readiness
  probe can help here since the process dies before it ever serves traffic.
- **Fix direction (not yet done)**: move `create_all` out of import-time
  into an app startup event/lifespan handler with retry/backoff, or drop it
  entirely in favor of Alembic migrations (the code comment already flags
  `create_all` as a simplification: "usually use alembic").
- **Target pass**: revisit when building the Kubernetes pass (init
  containers / readiness gating) or when adding Alembic.

---

## Pass log

### Pass 0 — App hardening (branch: `pass0/health-endpoint`)
- Added `GET /health` — checks Postgres (`SELECT 1`) as a hard dependency
  (503 on failure) and Redis (`PING`) as a soft dependency, consistent with
  the existing `REDIS_ENABLED` graceful-degradation pattern in
  `app/redis/cache.py`.
- Verified locally: DB up + Redis disabled (200/ok), DB down at startup
  (crash — see known issue #1 above), DB up + Redis enabled but unreachable
  (200/ok with redis error noted, not 503).
- Still open for this pass: Dockerfile `HEALTHCHECK` directives, prod-mode
  frontend/backend Dockerfiles (currently ship dev servers), `.dockerignore`
  for both frontend/backend, README clone URL fix.