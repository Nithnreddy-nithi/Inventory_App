from sqlalchemy import Column, Integer, String, Text, DateTime, func
from app.database.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    entity_name = Column(String(50), nullable=False)
    entity_id = Column(Integer, nullable=False)
    operation = Column(String(10), nullable=False)  # INSERT / UPDATE / DELETE
    old_data = Column(Text, nullable=True)
    new_data = Column(Text, nullable=True)
    performed_by = Column(Integer, nullable=True)  # user_id
    performed_at = Column(DateTime, server_default=func.now())
