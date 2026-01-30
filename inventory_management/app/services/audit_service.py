from sqlalchemy.orm import Session
from app.repositories.audit_repository import create_audit_log

def log_action(db: Session, entity, entity_id, operation, old=None, new=None, user_id=None):
    create_audit_log(
        db=db,
        entity_name=entity,
        entity_id=entity_id,
        operation=operation,
        old_data=old,
        new_data=new,
        user_id=user_id
    )
from sqlalchemy.orm import Session
from app.repositories.audit_repository import audit_repo

class AuditService:

    def list_all(self, db: Session):
        return audit_repo.get_all(db)

    def filter_by_entity(self, db: Session, entity_name: str):
        return audit_repo.get_by_entity(db, entity_name)

    def filter_by_user(self, db: Session, user_id: int):
        return audit_repo.get_by_user(db, user_id)

audit_service = AuditService()

