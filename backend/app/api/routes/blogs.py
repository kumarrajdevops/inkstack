from typing import List
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models.blog import Blog
from app.db.models.user import User
from app.schemas import BlogCreate, BlogUpdate, Blog as BlogSchema, BlogListResponse
from app.api import deps
from app.redis import cache

router = APIRouter()

from sqlalchemy import or_

@router.get("/", response_model=BlogListResponse)
def read_blogs(response: Response, skip: int = 0, limit: int = 100, search: str = None, db: Session = Depends(get_db)):
    # Create cache key including search param
    cache_key = f"blogs:{skip}:{limit}:{search or 'all'}"
    cached_data = cache.get_cache(cache_key)
    
    if cached_data:
        response.headers["X-Cache"] = "HIT"
        response.headers["Cache-Control"] = "no-store"
        return cached_data

    query = db.query(Blog)
    
    if search:
        search_filter = or_(Blog.title.ilike(f"%{search}%"), Blog.content.ilike(f"%{search}%"))
        query = query.filter(search_filter)
    
    total = query.count()
    blogs = query.order_by(Blog.created_at.desc()).offset(skip).limit(limit).all()

    # Manually serialize for cache
    serialized_items = [BlogSchema.model_validate(b).model_dump(mode='json') for b in blogs]
    
    result = {
        "items": serialized_items,
        "total": total,
        "page": (skip // limit) + 1,
        "size": limit
    }
    
    cache.set_cache(cache_key, result)
    
    response.headers["X-Cache"] = "MISS"
    response.headers["Cache-Control"] = "no-store"
    return result

@router.post("/", response_model=BlogSchema)
def create_blog(blog: BlogCreate, db: Session = Depends(get_db), current_user: User = Depends(deps.get_current_user)):
    new_blog = Blog(
        title=blog.title,
        content=blog.content,
        image_url=blog.image_url,
        author_id=current_user.id
    )
    db.add(new_blog)
    db.commit()
    db.refresh(new_blog)
    
    
    # Invalidate cache
    # Ideally use a more targeted invalidation strategy
    # For now, just clearing the main list cache might be complex due to pagination keys
    # Simplified approach: We won't clear all keys but just be aware of TTL.
    # Or we can delete specific known keys if we tracked them.
    # For this demo, let's just rely on TTL or clear a "latest" key if we had one.
    
    # Invalidate all blog lists
    cache.delete_pattern("blogs:*")
    
    return new_blog
@router.get("/{id}", response_model=BlogSchema)
def read_blog(id: int, response: Response, db: Session = Depends(get_db)):
    cache_key = f"blog:{id}"
    cached_data = cache.get_cache(cache_key)
    
    if cached_data:
        # Deserialize if needed, or if cached_data is compatible dict
        response.headers["X-Cache"] = "HIT"
        # Optional: Add No-Cache here too if desired, though detail view changes less often than list
        return cached_data

    blog = db.query(Blog).filter(Blog.id == id).first()
    if blog is None:
        raise HTTPException(status_code=404, detail="Blog not found")
    
    # Serialize for cache
    serialized_blog = BlogSchema.model_validate(blog).model_dump(mode='json')
    cache.set_cache(cache_key, serialized_blog)
    
    response.headers["X-Cache"] = "MISS"
    return blog

@router.put("/{id}", response_model=BlogSchema)
def update_blog(id: int, blog_update: BlogUpdate, db: Session = Depends(get_db), current_user: User = Depends(deps.get_current_user)):
    blog = db.query(Blog).filter(Blog.id == id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    
    if blog.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this blog")
    
    blog.title = blog_update.title
    blog.content = blog_update.content
    if blog_update.image_url:
        blog.image_url = blog_update.image_url
    
    db.commit()
    db.refresh(blog)
    
    # Invalidate cache
    cache.delete_cache(f"blog:{id}")
    # Invalidate list cache
    cache.delete_pattern("blogs:*")
    
    return blog

@router.delete("/{id}", status_code=204)
def delete_blog(id: int, db: Session = Depends(get_db), current_user: User = Depends(deps.get_current_user)):
    blog = db.query(Blog).filter(Blog.id == id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    
    if blog.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this blog")
    
    db.delete(blog)
    db.commit()
    
    # Invalidate cache
    cache.delete_cache(f"blog:{id}")
    cache.delete_pattern("blogs:*")
    
    return None
