from fastapi import FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.api.routes import auth, blogs, config, users
from app.db.session import engine, Base
from app.core.config import settings
from app.redis.cache import r as redis_client

# Create tables on startup (for simplicity in this setup, usually use alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Inkstack API")

# CORS
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
# user routes
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(blogs.router, prefix="/api/blogs", tags=["blogs"])
app.include_router(config.router, prefix="/api/config", tags=["config"])

@app.get("/")
def root():
    return {"message": "Welcome to Inkstack API"}


@app.get("/health")
def health(response: Response):
    """
    Liveness/readiness style health check.
    - DB is a hard dependency: if it's down, report unhealthy (503).
    - Redis is a soft dependency (app degrades gracefully without it per
      REDIS_ENABLED), so a Redis failure is reported but doesn't flip
      overall status to unhealthy.
    """
    checks = {"database": "unknown", "redis": "unknown"}
    healthy = True

    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        checks["database"] = "ok"
    except Exception as e:
        checks["database"] = f"error: {e.__class__.__name__}"
        healthy = False

    if settings.REDIS_ENABLED:
        try:
            redis_client.ping()
            checks["redis"] = "ok"
        except Exception as e:
            checks["redis"] = f"error: {e.__class__.__name__}"
    else:
        checks["redis"] = "disabled"

    if not healthy:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    return {"status": "ok" if healthy else "unhealthy", "checks": checks}