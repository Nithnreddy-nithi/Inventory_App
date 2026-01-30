from fastapi import APIRouter, Depends
from app.services.auth_service import require_role

router = APIRouter(prefix="/admin", tags=["admin"])
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from app.dependencies.admin import admin_required

router = APIRouter(
    prefix="/admin/users",
    tags=["Admin - Users"]
)

# 🔹 List users
@router.get("/")
def list_users(
    db: Session = Depends(get_db),
    admin = Depends(admin_required)
):
    return db.query(User).all()

# 🔹 Change role
@router.put("/{user_id}/role")
def change_role(
    user_id: int,
    role: str,
    db: Session = Depends(get_db),
    admin = Depends(admin_required)
):
    user = db.query(User).get(user_id)
    if not user:
        raise HTTPException(404, "User not found")

    user.role = role
    db.commit()
    return {"message": "Role updated"}

# 🔹 Delete user
@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin = Depends(admin_required)
):
    user = db.query(User).get(user_id)
    if not user:
        raise HTTPException(404, "User not found")

    db.delete(user)
    db.commit()
    return {"message": "User deleted"}

