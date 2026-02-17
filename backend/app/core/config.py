from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    REDIS_HOST: str = "redis"
    REDIS_PORT: int = 6379
    REDIS_ENABLED: bool = True
    JWT_SECRET: str = "supersecretkey"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

settings = Settings()
