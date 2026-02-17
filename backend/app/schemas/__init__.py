from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# User Schemas
class UserBase(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None 
    email: Optional[str] = None

class User(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Blog Schemas
class BlogBase(BaseModel):
    title: str
    content: str
    image_url: Optional[str] = None

class BlogCreate(BlogBase):
    pass

class BlogUpdate(BlogBase):
    pass

class Blog(BlogBase):
    id: int
    author_id: int
    created_at: datetime
    author: Optional[User] = None

    class Config:
        from_attributes = True

class BlogListResponse(BaseModel):
    items: list[Blog]
    total: int
    page: int
    size: int

# Comment Schemas
class CommentBase(BaseModel):
    content: str
    blog_id: int

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    author_id: int
    created_at: datetime
    author: Optional[User] = None

    class Config:
        from_attributes = True
