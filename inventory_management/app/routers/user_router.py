from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.models.user import User

router = APIRouter()

@router.get("/users")
def list_users(db: Session = Depends(get_db)):
    # automatically has current_user_id in db.info
    return db.query(User).all()
