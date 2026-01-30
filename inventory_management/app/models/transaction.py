# app/models/transaction.py
from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
from app.database.database import Base
from datetime import datetime

class InventoryTransaction(Base):
    __tablename__ = "inventory_transactions"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    # limit length so SQL Server doesn't create a MAX type which can't be indexed
    type = Column(String(50), index=True)  # "sale", "purchase", "adjustment"
    quantity = Column(Float)
    unit_price = Column(Float, nullable=True)
    total_price = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="transactions")
