# app/services/auth_service.py
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.config import settings
from app.database.database import get_db
from app.repositories.user_repository import get_user_by_username, create_user, get_user_by_id

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


def register_user(db: Session, username: str, password: str, role: str = "staff"):
    """Register a new user"""
    existing = get_user_by_username(db, username)
    if existing:
        raise ValueError("Username already exists")
    hashed = get_password_hash(password)
    user = create_user(db=db, username=username, password_hash=hashed, role=role)
    return user


def authenticate_user(db: Session, username: str, password: str):
    """Verify user credentials and return access token"""
    user = get_user_by_username(db, username)
    if not user or not verify_password(password, user.password_hash):
        return None
    token = create_access_token(subject=user.id)
    return {"access_token": token, "token_type": "bearer", "user": user}


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Get the current user from token"""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication token")
        user = get_user_by_id(db, int(user_id))
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Token is invalid or expired")


def require_role(required_role: str):
    """Dependency for role-based access"""
    def role_checker(current_user = Depends(get_current_user)):
        if current_user.role not in required_role:
            raise HTTPException(status_code=403, detail="You don't have permission to access this resource")
        return current_user
    return role_checker
