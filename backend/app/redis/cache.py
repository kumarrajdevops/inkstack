import redis
import json
from typing import Any
from app.core.config import settings

# Use a connection pool or just client. 
# Redis client is lazy, so creation won't fail until used.
r = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, decode_responses=True)

def get_cache(key: str):
    if not settings.REDIS_ENABLED:
        return None
    try:
        data = r.get(key)
        if data:
            return json.loads(data)
    except redis.RedisError as e:
        print(f"Redis error in get_cache: {e}")
    return None

def set_cache(key: str, value: Any, expire: int = 60):
    if not settings.REDIS_ENABLED:
        return
    try:
        r.set(key, json.dumps(value, default=str), ex=expire)
    except redis.RedisError as e:
        print(f"Redis error in set_cache: {e}")

def delete_cache(key: str):
    if not settings.REDIS_ENABLED:
        return
    try:
        r.delete(key)
    except redis.RedisError as e:
        print(f"Redis error in delete_cache: {e}")

def delete_pattern(pattern: str):
    if not settings.REDIS_ENABLED:
        return
    try:
        # Use scan_iter for safer pattern matching than keys()
        keys = list(r.scan_iter(pattern))
        if keys:
            r.delete(*keys)
    except redis.RedisError as e:
        print(f"Redis error in delete_pattern: {e}")
