from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    bio = Column(String)
    avatar_url = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    blogs = relationship("Blog", back_populates="author")
