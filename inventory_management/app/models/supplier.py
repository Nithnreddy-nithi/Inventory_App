# app/models/supplier.py
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database.database import Base

class Supplier(Base):
    __tablename__ = "suppliers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), unique=True, nullable=False)

    products = relationship("Product", back_populates="supplier")
    purchases = relationship("Purchase", back_populates="supplier")

