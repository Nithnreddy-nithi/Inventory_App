from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.audit_service import audit_service
from app.schemas.audit_schema import AuditLogOut

router = APIRouter(prefix="/audit", tags=["Audit Logs"])

@router.get("/logs", response_model=list[AuditLogOut])
def get_all_logs(db: Session = Depends(get_db)):
    return audit_service.list_all(db)

@router.get("/logs/entity/{entity_name}", response_model=list[AuditLogOut])
def get_logs_by_entity(entity_name: str, db: Session = Depends(get_db)):
    return audit_service.filter_by_entity(db, entity_name)

@router.get("/logs/user/{user_id}", response_model=list[AuditLogOut])
def get_logs_by_user(user_id: int, db: Session = Depends(get_db)):
    return audit_service.filter_by_user(db, user_id)
