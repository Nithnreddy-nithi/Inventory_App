# app/routers/auth_router.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.core.security import verify_password,get_password_hash
from app.database.database import get_db
from app.schemas.user_schema import UserCreate, UserOut
from app.services.auth_service import register_user, authenticate_user, get_current_user
from app.models.user import User
from app.schemas.user_schema import  ChangePasswordRequest


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    try:
        user = register_user(db, payload.username, payload.password, payload.role)
        return user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/token")
def login_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    auth = authenticate_user(db, form_data.username, form_data.password)
    if not auth:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return auth


@router.get("/profile")
def profile(current_user = Depends(get_current_user)):
    return {"id": current_user.id, "username": current_user.username, "role": current_user.role}

@router.put("/change-password")
def change_password(
    data: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not verify_password(data.old_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Old password is incorrect")

    current_user.password_hash = get_password_hash(data.new_password)
    db.commit()

    return {"message": "Password updated successfully"}


