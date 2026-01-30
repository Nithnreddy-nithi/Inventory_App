from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AuditLogOut(BaseModel):
    id: int
    entity_name: str
    entity_id: int
    operation: str
    old_data: Optional[str]
    new_data: Optional[str]
    performed_by: Optional[int]
    performed_at: datetime

    class Config:
        from_attributes = True
