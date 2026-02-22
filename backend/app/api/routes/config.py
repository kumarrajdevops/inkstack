from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models.config import SystemConfig
from app.redis import cache
from pydantic import BaseModel

router = APIRouter()

class ConfigResponse(BaseModel):
    key: str
    value: str

@router.get("/footer", response_model=ConfigResponse)
def get_footer_config(response: Response, db: Session = Depends(get_db)):
    cache_key = "config:footer"
    cached_data = cache.get_cache(cache_key)
    
    if cached_data:
        response.headers["X-Cache"] = "HIT"
        return cached_data

    config = db.query(SystemConfig).filter(SystemConfig.key == "footer_text").first()
    
    if not config:
        # Fallback default if DB is empty or init script hasn't run yet
        return {"key": "footer_text", "value": "© 2024 Inkstack"}

    response_data = {"key": config.key, "value": config.value}
    cache.set_cache(cache_key, response_data, expire=3600) # Cache for 1 hour
    
    response.headers["X-Cache"] = "MISS"
    return response_data
