from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.db.session import get_db
from app.db.models.user import User
from app.core import security
from app.schemas import UserCreate, Token, User as UserSchema

router = APIRouter()

@router.post("/signup", response_model=UserSchema)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = security.get_password_hash(user.password)
    new_user = User(
        username=user.username,
        password_hash=hashed_password,
        email=user.email,
        full_name=user.full_name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = security.create_access_token(subject=user.username)
    return {"access_token": access_token, "token_type": "bearer"}
