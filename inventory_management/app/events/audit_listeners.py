import json
from datetime import datetime
from sqlalchemy.inspection import inspect
from app.models.audit import AuditLog


def serialize_instance(obj):
    try:
        return {
            c.key: getattr(obj, c.key)
            for c in inspect(obj).mapper.column_attrs
        }
    except Exception:
        return {}


def after_insert(mapper, connection, target):
    data = serialize_instance(target)

    connection.execute(
        AuditLog.__table__.insert(),
        {
            "entity_name": target.__tablename__,
            "entity_id": getattr(target, "id", None),
            "operation": "INSERT",
            "old_data": None,
            "new_data": json.dumps(data, default=str),
            "performed_by": None,
            "performed_at": datetime.utcnow(),
        }
    )


def after_update(mapper, connection, target):
    state = inspect(target)
    old_values = {}
    new_values = {}

    for attr in state.attrs:
        hist = attr.history
        if hist.has_changes():
            if hist.deleted:
                old_values[attr.key] = hist.deleted[0]
            if hist.added:
                new_values[attr.key] = hist.added[0]

    if not old_values and not new_values:
        return

    connection.execute(
        AuditLog.__table__.insert(),
        {
            "entity_name": target.__tablename__,
            "entity_id": getattr(target, "id", None),
            "operation": "UPDATE",
            "old_data": json.dumps(old_values, default=str),
            "new_data": json.dumps(new_values, default=str),
            "performed_by": None,
            "performed_at": datetime.utcnow(),
        }
    )


def after_delete(mapper, connection, target):
    data = serialize_instance(target)

    connection.execute(
        AuditLog.__table__.insert(),
        {
            "entity_name": target.__tablename__,
            "entity_id": getattr(target, "id", None),
            "operation": "DELETE",
            "old_data": json.dumps(data, default=str),
            "new_data": None,
            "performed_by": None,
            "performed_at": datetime.utcnow(),
        }
    )
