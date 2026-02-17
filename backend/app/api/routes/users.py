from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models.user import User
from app.schemas import User as UserSchema, UserUpdate
from app.api import deps

router = APIRouter()

@router.get("/{username}", response_model=UserSchema)
def read_user(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/me", response_model=UserSchema)
def update_user_me(user_update: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(deps.get_current_user)):
    user = db.query(User).filter(User.id == current_user.id).first()
    
    if user_update.full_name is not None:
        user.full_name = user_update.full_name
    if user_update.bio is not None:
        user.bio = user_update.bio
    if user_update.avatar_url is not None:
        user.avatar_url = user_update.avatar_url
    if user_update.email is not None:
        # check if email exists
        existing_user = db.query(User).filter(User.email == user_update.email).first()
        if existing_user and existing_user.id != user.id:
            raise HTTPException(status_code=400, detail="Email already registered")
        user.email = user_update.email
        
    db.commit()
    db.refresh(user)
    return user
