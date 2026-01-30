from sqlalchemy import Column, Integer, ForeignKey, DateTime, String, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base

class Purchase(Base):
    __tablename__ = "purchases"

    id = Column(Integer, primary_key=True, index=True)

    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False)

    status = Column(String(50), default="draft")  
    # draft | received | cancelled

    total_amount = Column(Float, default=0.0)

    created_at = Column(DateTime, default=datetime.utcnow)

    # relationships
    supplier = relationship("Supplier", back_populates="purchases")
    items = relationship(
        "PurchaseItem",
        back_populates="purchase",
        cascade="all, delete-orphan"
    )
