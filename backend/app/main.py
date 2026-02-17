from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, blogs, config, users
from app.db.session import engine, Base

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
