import json
from sqlalchemy.orm import Session
from app.models.audit import AuditLog

def create_audit_log(db: Session, entity_name, entity_id, operation, old_data=None, new_data=None, user_id=None):
    audit_record = AuditLog(
        entity_name=entity_name,
        entity_id=entity_id,
        operation=operation,
        old_data=json.dumps(old_data) if old_data else None,
        new_data=json.dumps(new_data) if new_data else None,
        performed_by=user_id,
    )
    db.add(audit_record)    
    db.commit()
from sqlalchemy.orm import Session
from app.models.audit import AuditLog

class AuditRepository:

    def get_all(self, db: Session):
        return db.query(AuditLog).order_by(AuditLog.performed_at.desc()).all()

    def get_by_entity(self, db: Session, entity_name: str):
        return db.query(AuditLog).filter(AuditLog.entity_name == entity_name).order_by(AuditLog.performed_at.desc()).all()

    def get_by_user(self, db: Session, user_id: int):
        return db.query(AuditLog).filter(AuditLog.performed_by == user_id).order_by(AuditLog.performed_at.desc()).all()

audit_repo = AuditRepository()
