# audit_events.py
import json
from sqlalchemy import event
from sqlalchemy.orm import Session
from sqlalchemy.inspection import inspect
from app.models.audit import AuditLog

def serialize_instance(obj):
    """Convert SQLAlchemy model to dict (column: value)."""
    try:
        return {c.key: getattr(obj, c.key) for c in inspect(obj).mapper.column_attrs}
    except Exception:
        return {}

def register_audit_events():
    """Attach SQLAlchemy events to automatically record inserts, updates, deletes."""

    @event.listens_for(Session, "after_flush")
    def receive_after_flush(session, flush_context):
        # Avoid recursive logging
        for obj in session.new:
            if isinstance(obj, AuditLog):
                continue

            log = AuditLog(
                entity_name=obj.__class__.__name__,
                entity_id=getattr(obj, "id", None),
                operation="INSERT",
                old_data=None,
                new_data=json.dumps(serialize_instance(obj)),
                performed_by=session.info.get("current_user_id"),
            )
            session.add(log)

        for obj in session.dirty:
            if isinstance(obj, AuditLog):
                continue

            state = inspect(obj)
            if not state.attrs:
                continue

            old_values = {}
            new_values = {}

            for attr in state.attrs:
                hist = attr.history
                if hist.has_changes():
                    if hist.deleted:
                        old_values[attr.key] = hist.deleted[0]
                    if hist.added:
                        new_values[attr.key] = hist.added[0]

            if old_values or new_values:
                log = AuditLog(
                    entity_name=obj.__class__.__name__,
                    entity_id=getattr(obj, "id", None),
                    operation="UPDATE",
                    old_data=json.dumps(old_values),
                    new_data=json.dumps(new_values),
                    performed_by=session.info.get("current_user_id"),
                )
                session.add(log)

        for obj in session.deleted:
            if isinstance(obj, AuditLog):
                continue

            log = AuditLog(
                entity_name=obj.__class__.__name__,
                entity_id=getattr(obj, "id", None),
                operation="DELETE",
                old_data=json.dumps(serialize_instance(obj)),
                new_data=None,
                performed_by=session.info.get("current_user_id"),
            )
            session.add(log)
